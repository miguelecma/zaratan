'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
      },
    },
  };

  const { error, data: authData } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  // Create client record
  if (authData.user) {
    const { error: clientError } = await supabase
      .from('clients')
      .insert({
        id: authData.user.id,
        email: data.email,
        name: data.options.data.name,
        phone: data.options.data.phone,
      });

    if (clientError) {
      console.error('Error creating client record:', clientError);
    }
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  // Update last login
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from('clients')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);
  }

  revalidatePath('/', 'layout');
  redirect('/order');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get client data
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', user.id)
    .single();

  return client;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const updates = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
  };

  const { error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

