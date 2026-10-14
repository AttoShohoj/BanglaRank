"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const clean = (v?: string) => (v ?? "").trim().replace(/^["']|["']$/g, "").trim();
function normalizeUrl(v?: string): string | null {
  let u = clean(v).replace(/\/+$/, "");
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try { new URL(u); return u; } catch { return null; }
}
let client: SupabaseClient | null = null;
export function getBrowserClient(): SupabaseClient | null {
  const url = normalizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !key) return null;
  return (client ??= createClient(url, key));
}
