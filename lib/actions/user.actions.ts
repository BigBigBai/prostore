'use server';

import { isRedirectError } from 'next/dist/client/components/redirect';
import { signIn, signOut } from '@/auth';
import { signInFormSchema } from '../validator';

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      passowrd: formData.get('passowrd'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: 'Invalid email or passowrd' };
  }
}

export async function signOutUser() {
  await signOut();
}


