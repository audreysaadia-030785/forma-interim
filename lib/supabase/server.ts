// Client Supabase pour le serveur (Server Components, Route Handlers, Server Actions).
// Lit la session depuis les cookies du navigateur.
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // L'appel setAll depuis un Server Component lève une erreur silencieuse
            // car le Component ne peut pas écrire de cookies. Pas grave, le middleware
            // se chargera de rafraîchir le cookie à la prochaine requête.
          }
        },
      },
    },
  );
}

/**
 * Client admin — utilise la clé secrète, bypasse RLS.
 * À n'utiliser que depuis le serveur, pour des opérations "admin-only".
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
