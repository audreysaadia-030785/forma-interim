import { createClient } from "@/lib/supabase/server";
import { ClientsManager } from "./clients-manager";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select(
      "id, company_name, siret, primary_contact_name, email, phone, active, created_at",
    )
    .order("created_at", { ascending: false });

  // Conversion snake_case → camelCase attendu par le composant.
  const rows = (clients ?? []).map((c) => ({
    id: c.id,
    companyName: c.company_name,
    siret: c.siret ?? undefined,
    primaryContact: c.primary_contact_name,
    email: c.email,
    phone: c.phone,
    active: c.active,
    createdAt: c.created_at,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Administration
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Vos clients
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Créez les comptes clients et gérez leur accès à la plateforme. Un
          compte et un mot de passe initial leur seront générés.
        </p>
      </header>

      <ClientsManager initial={rows} />
    </div>
  );
}
