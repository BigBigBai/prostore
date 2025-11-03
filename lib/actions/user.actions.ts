'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';
import { signIn, signOut } from '@/auth';
import { signInFormSchema } from '../validator';

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
