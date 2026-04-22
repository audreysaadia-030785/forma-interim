import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const path = request.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  // Seuls l'admin OU le client propriétaire peuvent accéder.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.role === "admin";

  if (!isAdmin) {
    // Vérifier que le path commence par le client_id de l'utilisateur.
    const { data: clientRow } = await supabase
      .from("clients")
      .select("id")
      .eq("primary_user_id", user.id)
      .maybeSingle();
    if (!clientRow || !path.startsWith(`${clientRow.id}/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const admin = createServiceClient();
  const { data: signed, error } = await admin.storage
    .from("job-specs")
    .createSignedUrl(path, 120);

  if (error || !signed) {
    return NextResponse.json(
      { error: error?.message ?? "Not found" },
      { status: 404 },
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}
