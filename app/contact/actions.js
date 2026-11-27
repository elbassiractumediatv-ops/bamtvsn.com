'use server';

import { redirect } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';

function field(form, name) {
  return String(form.get(name) ?? '').trim();
}

export async function sendContactMessage(form) {
  const name = field(form, 'name');
  const email = field(form, 'email').toLowerCase();
  const phone = field(form, 'phone');
  const subject = field(form, 'subject');
  const message = field(form, 'message');
  const website = field(form, 'website');

  // Honeypot: silently accept bot submissions without storing them.
  if (website) redirect('/contact?sent=1');

  const validEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  if (
    name.length < 2 || name.length > 100 ||
    !validEmail || email.length > 200 ||
    phone.length > 30 || subject.length > 150 ||
    message.length < 10 || message.length > 5000
  ) {
    redirect('/contact?error=validation');
  }

  try {
    const supabase = createPublicClient();
    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      is_read: false,
    });

    if (error) redirect('/contact?error=send');
  } catch (error) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error;
    redirect('/contact?error=send');
  }

  redirect('/contact?sent=1');
}
