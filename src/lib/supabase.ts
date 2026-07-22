import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** null quando as variaveis de ambiente nao estao configuradas — o app
 * funciona 100% via localStorage nesse caso, login fica indisponivel. */
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export function supabaseConfigurado(): boolean {
  return supabase !== null;
}
