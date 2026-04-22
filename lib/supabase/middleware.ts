// Middleware helper : rafraîchit la session Supabase à chaque requête
// et protège les routes qui demandent une authentification.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Si les env vars ne sont pas disponibles, on laisse passer la requête
  // sans vérif d'auth (évite un 500 sur toutes les pages).
  if (!url || !key) {
    console.error(
      "[proxy] Missing Supabase env vars",
      { hasUrl: !!url, hasKey: !!key },
    );
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/";
  const isProtected =
    pathname.startsWith("/client") || pathname.startsWith("/admin");

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = profile?.role === "admin" ? "/admin" : "/client";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/client";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}
