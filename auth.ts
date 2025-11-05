import { compareSync } from 'bcrypt-ts-edge';
// import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { prisma } from '@/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { authConfig } from '@/auth.config';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.name = token.name;
      session.user.role = token.role;

      if (trigger === 'update' && token.name) {
        session.user.name = user.name;
      }
      return session;
    },
    // async jwt({ token, user, trigger, session }: any) {
    //   if (user) {
    //     token.role = user.role;

    //     if (user.name === 'NO_NAME') {
    //       token.name = user.email!.split('@')[0];

    //       await prisma.user.update({
    //         where: { id: user.id },
    //         data: { name: token.name },
    //       });
    //     }
    //   }

    //   if (session?.user.name && trigger === 'update') {
    //     token.name = session.user.name;
    //   }
    //   return token;
    // },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger }: any) {
      if (user) {
        // Assign user properties to the token
        token.id = user.id;
        token.role = user.role;

        if (trigger === 'signIn' || trigger === 'signUp') {
          // cookies() from next/headers is only available on the server.
          // When this callback is executed in a browser/action context it will throw,
          // so only import and call it on the server (node) environment.
          if (typeof window === 'undefined') {
            const { cookies } = await import('next/headers');
            const cookiesObject = await cookies();
            const sessionCartId = cookiesObject.get('sessionCartId')?.value;

            if (sessionCartId) {
              const sessionCart = await prisma.cart.findFirst({
                where: { sessionCartId },
              });

              if (sessionCart) {
                // Overwrite any existing user cart
                await prisma.cart.deleteMany({
                  where: { userId: user.id },
                });

                // Assign the guest cart to the logged-in user
                await prisma.cart.update({
                  where: { id: sessionCart.id },
                  data: { userId: user.id },
                });
              }
            }
          }
        }
      }

      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
