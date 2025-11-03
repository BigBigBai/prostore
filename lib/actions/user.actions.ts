'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';
import { signIn, signOut } from '@/auth';
import { signInFormSchema, signUpFormSchema } from '../validator';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
// import { ZodError, z } from 'zod';
import { formatError } from '../utils';

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    // Parse and validate form inputs
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // Trigger NextAuth credentials sign-in and redirect to home on success
    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid email or password' };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    // if (error instanceof ZodError) {
    //   const treeZodError = z.treeifyError(error);
    //   const prettyZodError = z.prettifyError(error);
    //   console.log(treeZodError);
    //   console.log(prettyZodError);
    // }
    console.log(error.name);
    console.log(error.code);
    console.log(error.errors);
    console.log(error.meta?.target);

    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}
