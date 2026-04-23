import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CONTRACT_LABELS,
  REMINDER_CATEGORY_META,
  type HrEmployee,
  type HrReminder,
} from "@/lib/hr-types";
import { ClientRhAdminPanels } from "./admin-panels";

export const dynamic = "force-dynamic";

export default async function AdminRhClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, company_name, primary_contact_name, email, phone")
    .eq("id", clientId)
    .single();
  if (!client) notFound();

  const { data: employees } = await supabase
    .from("hr_employees")
    .select("*")
    .eq("client_id", clientId)
    .order("last_name");

  const { data: reminders } = await supabase
    .from("hr_reminders")
    .select("*")
    .eq("client_id", clientId)
    .order("due_date", { ascending: true });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2 flex-wrap">
        <Link href="/admin" className="hover:text-primary-600 transition">
          Demandes
        </Link>
        <span>/</span>
        <Link href="/admin/rh" className="hover:text-primary-600 transition">
          RH
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold truncate">
          {client.company_name}
        </span>
      </nav>

      <header className="mb-6 rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-900">
          {client.company_name}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          {client.primary_contact_name} · {client.email} · {client.phone}
        </p>
      </header>

      <ClientRhAdminPanels
        clientId={clientId}
        employees={(employees ?? []) as HrEmployee[]}
        reminders={(reminders ?? []) as HrReminder[]}
      />
    </div>
  );
}
