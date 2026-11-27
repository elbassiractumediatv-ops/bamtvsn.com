'use server';
import { redirect } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';

export async function sendContactMessage(form) {
  const name=String(form.get('name')??'').trim();
  const email=String(form.get('email')??'').trim().toLowerCase();
  const phone=String(form.get('phone')??'').trim();
  const subject=String(form.get('subject')??'').trim();
  const message=String(form.get('message')??'').trim();
  const website=String(form.get('website')??'').trim();
  if (website) redirect('/contact?sent=1');
  if(name.length<2||name.length>100||email.length<5||email.length>200||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||phone.length>30||subject.length>150||message.length<10||message.length>5000) redirect('/contact?error=invalid');
  const supabase=createPublicClient();
  const {error}=await supabase.from('contact_messages').insert({name,email,phone:phone||null,subject:subject||null,message,is_read:false});
  if(error) redirect('/contact?error=send');
  redirect('/contact?sent=1');
}
