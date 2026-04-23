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

const REQUEST_TYPE_ROW_META: Record<
  string,
  { label: string; emoji: string; barClass: string; badgeClass: string }
> = {
  recrutement: {
    label: "Recrutement",
    emoji: "👥",
    barClass: "bg-primary-500",
    badgeClass: "bg-primary-50 text-primary-700 ring-primary-200",
  },
  formation: {
    label: "Formation",
    emoji: "🎓",
    barClass: "bg-accent-500",
    badgeClass: "bg-accent-50 text-accent-700 ring-accent-200",
  },
  accompagnement_rh: {
    label: "Accompagnement RH",
    emoji: "⚖️",
    barClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
};

type RequestTypeFilter = "all" | "recrutement" | "formation" | "accompagnement_rh";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: RequestStatus | "all";
    client?: string;
    type?: RequestTypeFilter;
  }>;
}) {
  const { status = "all", client = "all", type = "all" } = await searchParams;
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
      `id, reference, client_id, job_label, headcount, start_date, duration_value, duration_unit, location, status, created_at,
       request_type, contract_type, cdd_duration_months, formation_category,
       clients(company_name)`,
    )
    .order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);
  if (client !== "all") query = query.eq("client_id", client);
  if (type !== "all") query = query.eq("request_type", type);
  const { data: requests } = await query;

  // Compteurs par type (pour les pills).
  const { data: allRequestsForCounts } = await supabase
    .from("requests")
    .select("request_type");
  const countByType = (t: RequestTypeFilter) =>
    (allRequestsForCounts ?? []).filter((r) =>
      t === "all" ? true : r.request_type === t,
    ).length;

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

      <section className="mb-6 space-y-4 animate-fade-up">
        <h2 className="text-xl font-bold text-primary-900">
          Demandes{" "}
          <span className="text-neutral-500 font-medium text-base">
            ({requests?.length ?? 0})
          </span>
        </h2>

        {/* FILTRE PRINCIPAL — Type de demande */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 shrink-0">
            Type
          </span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "all", label: "Toutes", emoji: "📋" },
                { key: "recrutement", label: "Recrutement", emoji: "👥" },
                { key: "formation", label: "Formation", emoji: "🎓" },
                { key: "accompagnement_rh", label: "Accompagnement RH", emoji: "⚖️" },
              ] as const
            ).map((t) => {
              const active = type === t.key;
              const params = new URLSearchParams();
              if (t.key !== "all") params.set("type", t.key);
              if (status !== "all") params.set("status", status);
              if (client !== "all") params.set("client", client);
              const href = `/admin${params.toString() ? `?${params}` : ""}`;
              const count = countByType(t.key);
              return (
                <Link
                  key={t.key}
                  href={href}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    active
                      ? "bg-primary-700 text-white shadow-md"
                      : "bg-white ring-1 ring-neutral-200 text-neutral-700 hover:bg-primary-50 hover:ring-primary-300"
                  }`}
                >
                  <span>{t.emoji}</span>
                  {t.label}
                  <span className="opacity-70 text-xs">({count})</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* FILTRES SECONDAIRES — Statut + Client */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 shrink-0">
            Statut
          </span>
          <div className="flex gap-1 overflow-x-auto rounded-full bg-white ring-1 ring-neutral-200 p-1">
            {FILTERS.map((f) => {
              const active = f.key === status;
              const params = new URLSearchParams();
              if (type !== "all") params.set("type", type);
              if (f.key !== "all") params.set("status", f.key);
              if (client !== "all") params.set("client", client);
              const href = `/admin${params.toString() ? `?${params}` : ""}`;
              return (
                <Link
                  key={f.key}
                  href={href}
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

          <form method="get" className="flex gap-2 items-center sm:ml-auto">
            {type !== "all" && <input type="hidden" name="type" value={type} />}
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 shrink-0">
              Client
            </span>
            <select
              name="client"
              defaultValue={client}
              className="rounded-full bg-white ring-1 ring-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 cursor-pointer focus:ring-primary-500 focus:outline-none"
            >
              <option value="all">Tous</option>
              {(clients ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-primary-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-primary-700 transition"
            >
              Filtrer
            </button>
          </form>
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
                <th className="text-left px-4 py-3 font-semibold w-8"></th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
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
                const typeMeta = REQUEST_TYPE_ROW_META[req.request_type ?? "recrutement"] ?? REQUEST_TYPE_ROW_META.recrutement;
                return (
                  <tr
                    key={req.id}
                    className="hover:bg-primary-50/40 transition-colors animate-fade-up relative"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-0 py-0">
                      <span className={`block w-1.5 h-full min-h-[3.5rem] ${typeMeta.barClass}`} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset whitespace-nowrap ${typeMeta.badgeClass}`}
                      >
                        <span>{typeMeta.emoji}</span>
                        {typeMeta.label}
                      </span>
                    </td>
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
                      <div className="font-semibold text-primary-900 flex items-center gap-2 flex-wrap">
                        {req.job_label}
                        {req.contract_type && (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200 uppercase">
                            {req.contract_type}
                            {req.cdd_duration_months
                              ? ` ${req.cdd_duration_months}m`
                              : ""}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {req.headcount} poste{req.headcount > 1 ? "s" : ""} ·{" "}
                        {req.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700 whitespace-nowrap">
                      {formatShortDate(req.start_date)}
                      <div className="text-xs text-neutral-500">
                        {req.duration_value && req.duration_unit
                          ? `${req.duration_value} ${req.duration_unit}`
                          : req.contract_type === "cdi"
                            ? "Indéterminée"
                            : "—"}
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
