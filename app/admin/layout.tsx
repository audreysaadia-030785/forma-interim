import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Topbar } from "../components/topbar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Espace admin — Forma Interim",
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/client");

  return (
    <div className="flex-1 flex flex-col bg-neutral-50">
      <Topbar
        role="admin"
        userName={profile?.full_name ?? user.email ?? "Admin"}
        userCompany="Forma Interim"
      />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-neutral-500 flex flex-col sm:flex-row gap-2 sm:justify-between items-center">
          <span>© {new Date().getFullYear()} Forma Interim — Administration</span>
          <span className="text-xs text-neutral-400">
            Espace réservé — Actions tracées et journalisées
          </span>
        </div>
      </footer>
    </div>
  );
}
