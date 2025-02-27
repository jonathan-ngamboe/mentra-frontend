"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signInByMagicLink(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: "/auth/confirm",
    },
  });

  if (error) {
    redirect("/error");
  }
}

export async function signinByOtp(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
  });

  if (error) {
    const authError = error as any;
    authError.__isAuthError = true;
    throw authError;
  }
}

export async function verifyOtp(token: string, email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    const authError = error as any;
    authError.__isAuthError = true;
    throw authError;
  }
}
