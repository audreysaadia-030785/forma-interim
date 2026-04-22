import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match toutes les requêtes sauf celles vers :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico, logo.png, fichiers publics divers
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.*\\.png|.*\\.svg).*)",
  ],
};
