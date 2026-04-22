import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STATUS_META, formatShortDate, type RequestStatus } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

const FILTERS: Array<{ key: RequestStatus | "all"; label: string }> = [
  { key: "all", label: "Toutes" },
  { key: "pending", label: "En attente" },
  { key: "proposed", label: "Candidats proposés" },
  { key: "validated", label: "Validées" },
  { key: "refused", label: "Refusées" },
  { key: "cancelled", label: "Annulées" },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: RequestStatus | "all"; client?: string }>;
}) {
  const { status = "all", client = "all" } = await searchParams;
  const supabase = await createClient();

  // Liste des clients pour le filtre.
  const { data: clients } = await supabase
    .from("clients")
    .select("id, company_name, active")
    .order("company_name", { ascending: true });

  // Demandes filtrées.
  let query = supabase
    .from("requests")
    .select(
      "id, reference, client_id, job_label, headcount, start_date, duration_value, duration_unit, location, status, created_at, clients(company_name)",
    )
    .order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);
  if (client !== "all") query = query.eq("client_id", client);
  const { data: requests } = await query;

  // KPIs (sur l'ensemble non filtré).
  const { data: allRequests } = await supabase.from("requests").select("status");
  const pending = (allRequests ?? []).filter((r) => r.status === "pending").length;
  const proposed = (allRequests ?? []).filter((r) => r.status === "proposed").length;
  const validated = (allRequests ?? []).filter((r) => r.status === "validated").length;
  const activeClients = (clients ?? []).filter((c) => c.active).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 animate-fade-up">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
            Administration
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
            Bonjour Audrey 👋
          </h1>
          <p className="mt-2 text-neutral-600">
            Supervisez les demandes de vos clients et proposez les bons profils.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-fade-up">
        <KPI label="Demandes en attente" value={pending} color="accent" href="/admin?status=pending" pulse={pending > 0} />
        <KPI label="Validations attendues" value={proposed} color="primary" href="/admin?status=proposed" />
        <KPI label="Missions validées" value={validated} color="success" href="/admin?status=validated" />
        <KPI label="Clients actifs" value={activeClients} color="neutral" href="/admin/clients" />
      </section>

      <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-up">
        <div>
          <h2 className="text-xl font-bold text-primary-900">
            Demandes{" "}
            <span className="text-neutral-500 font-medium text-base">
              ({requests?.length ?? 0})
            </span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <form method="get" className="flex gap-2 items-center">
            <input type="hidden" name="status" value={status} />
            <select
              name="client"
              defaultValue={client}
              className="rounded-full bg-white ring-1 ring-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 cursor-pointer focus:ring-primary-500 focus:outline-none"
            >
              <option value="all">Tous les clients</option>
              {(clients ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-primary-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-700 transition"
            >
              Filtrer
            </button>
          </form>

          <div className="flex gap-1 overflow-x-auto rounded-full bg-white ring-1 ring-neutral-200 p-1">
            {FILTERS.map((f) => {
              const active = f.key === status;
              return (
                <Link
                  key={f.key}
                  href={
                    f.key === "all"
                      ? "/admin"
                      : `/admin?status=${f.key}${client !== "all" ? `&client=${client}` : ""}`
                  }
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-primary-700"
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {(requests ?? []).length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="text-neutral-500">
            {status === "all" && client === "all"
              ? "Aucune demande pour le moment. Vos clients n'ont pas encore saisi de demande."
              : "Aucune demande dans cette catégorie."}
          </p>
        </div>
      ) : (
        <div className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm overflow-hidden animate-fade-up">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Référence</th>
                <th className="text-left px-4 py-3 font-semibold">Client</th>
                <th className="text-left px-4 py-3 font-semibold">Poste</th>
                <th className="text-left px-4 py-3 font-semibold">Démarrage</th>
                <th className="text-left px-4 py-3 font-semibold">Statut</th>
                <th className="text-right px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(requests ?? []).map((req, i) => {
                const meta = STATUS_META[req.status as RequestStatus];
                return (
                  <tr
                    key={req.id}
                    className="hover:bg-primary-50/40 transition-colors animate-fade-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-4 py-3 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                      {req.reference}
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary-900">
                      {
                        // @ts-expect-error relation
                        req.clients?.company_name ?? ""
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-primary-900">
                        {req.job_label}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {req.headcount} poste{req.headcount > 1 ? "s" : ""} ·{" "}
                        {req.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">
                      {formatShortDate(req.start_date)}
                      <div className="text-xs text-neutral-500">
                        {req.duration_value} {req.duration_unit}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/demande/${req.id}`}
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius-button)] bg-primary-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-700 transition"
                      >
                        Ouvrir
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path
                            d="M4.5 10h11m0 0L10 4.5M15.5 10 10 15.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function KPI({
  label,
  value,
  color,
  href,
  pulse,
}: {
  label: string;
  value: number;
  color: "primary" | "accent" | "success" | "neutral";
  href?: string;
  pulse?: boolean;
}) {
  const styles = {
    primary: "bg-primary-50 text-primary-700",
    accent: "bg-accent-50 text-accent-700",
    success: "bg-emerald-50 text-emerald-700",
    neutral: "bg-neutral-100 text-neutral-700",
  }[color];

  const content = (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold text-primary-900">{value}</p>
      <span
        className={`absolute top-4 right-4 inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${styles}`}
      >
        {pulse ? (
          <span className="relative mr-1 flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-current opacity-75 animate-ping" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
          </span>
        ) : null}
        Live
      </span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
