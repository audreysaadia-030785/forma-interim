import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminRhOverviewPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, company_name, active")
    .order("company_name");

  const { data: employees } = await supabase
    .from("hr_employees")
    .select("client_id");
  const empByClient = new Map<string, number>();
  for (const e of employees ?? []) {
    empByClient.set(e.client_id, (empByClient.get(e.client_id) ?? 0) + 1);
  }

  const { data: reminders } = await supabase
    .from("hr_reminders")
    .select("client_id, done, due_date");
  const remByClient = new Map<string, { todo: number; overdue: number }>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const r of reminders ?? []) {
    const current = remByClient.get(r.client_id) ?? { todo: 0, overdue: 0 };
    if (!r.done) {
      current.todo++;
      if (new Date(r.due_date) < today) current.overdue++;
    }
    remByClient.set(r.client_id, current);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2">
        <Link href="/admin" className="hover:text-primary-600 transition">
          Demandes
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold">RH</span>
      </nav>

      <header className="mb-8 flex items-center justify-between gap-3 flex-wrap animate-fade-up">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
            Accompagnement RH
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
            Pilotage RH
          </h1>
          <p className="mt-2 text-neutral-600 max-w-2xl">
            Alimentez les espaces RH de vos clients : rappels, effectifs,
            documents.
          </p>
        </div>
        <Link
          href="/admin/rh/documents"
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800 transition"
        >
          📁 Gérer la bibliothèque
        </Link>
      </header>

      <section className="animate-fade-up">
        <h2 className="text-lg font-bold text-primary-900 mb-3">Mes clients</h2>
        {(clients ?? []).length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
            Aucun client enregistré. Créez-en un depuis l&apos;onglet Clients.
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(clients ?? []).map((c) => {
              const empCount = empByClient.get(c.id) ?? 0;
              const remData = remByClient.get(c.id) ?? { todo: 0, overdue: 0 };
              return (
                <li key={c.id}>
                  <Link
                    href={`/admin/rh/clients/${c.id}`}
                    className="block rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm hover:shadow-md hover:ring-primary-200 hover:-translate-y-0.5 transition-all p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-extrabold shrink-0">
                        {c.company_name
                          .split(/\s+/)
                          .map((p: string) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-primary-900 truncate">
                          {c.company_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {c.active ? "Actif" : "Désactivé"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                          Salariés
                        </p>
                        <p className="text-lg font-extrabold text-primary-900">
                          {empCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                          Rappels
                        </p>
                        <p className="text-lg font-extrabold text-primary-900">
                          {remData.todo}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                          En retard
                        </p>
                        <p
                          className={`text-lg font-extrabold ${
                            remData.overdue > 0 ? "text-rose-600" : "text-primary-900"
                          }`}
                        >
                          {remData.overdue}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
