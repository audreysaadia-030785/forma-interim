import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Topbar } from "../components/topbar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Espace client — Forma Interim",
};

export default async function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Récupère le nom de l'entreprise associée au compte.
  const { data: clientRow } = await supabase
    .from("clients")
    .select("company_name")
    .eq("primary_user_id", user.id)
    .maybeSingle();

  return (
    <div className="flex-1 flex flex-col bg-neutral-50">
      <Topbar
        role="client"
        userName={profile?.full_name ?? user.email ?? "Client"}
        userCompany={clientRow?.company_name}
      />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-neutral-500 flex flex-col sm:flex-row gap-2 sm:justify-between items-center">
          <span>
            © {new Date().getFullYear()} Forma Interim — Votre talent, notre
            mission
          </span>
          <span className="flex items-center gap-4">
            <a
              href="#"
              className="hover:text-primary-600 transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="hover:text-primary-600 transition-colors"
            >
              Politique de confidentialité
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
