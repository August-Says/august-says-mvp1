
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type SignInCredentials = {
  email: string;
  password: string;
};

export const signIn = async ({ email, password }: SignInCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    toast.error('An unexpected error occurred during sign in');
    return { user: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return { error };
    }
    return { error: null };
  } catch (error: any) {
    toast.error('An unexpected error occurred during sign out');
    return { error };
  }
};
