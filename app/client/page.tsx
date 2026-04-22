import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RequestCard } from "../components/request-card";
import { StatsTile } from "../components/stats-tile";
import { RequestsFilter } from "../components/requests-filter";
import type { InterimRequest, RequestStatus } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: RequestStatus | "all" }>;
}) {
  const { status = "all" } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  let query = supabase
    .from("requests")
    .select(
      "id, reference, client_id, job_label, headcount, start_date, duration_value, duration_unit, location, hourly_rate_eur, meal_bonus_eur, status, created_at, clients(company_name)",
    )
    .order("created_at", { ascending: false });

  if (status !== "all") query = query.eq("status", status);

  const { data: rawRequests } = await query;

  const requests: InterimRequest[] = (rawRequests ?? []).map((r) => ({
    id: r.id,
    clientId: r.client_id,
    clientCompanyName:
      // @ts-expect-error relation typed as array by default
      r.clients?.company_name ?? "",
    poste: r.job_label,
    headcount: r.headcount,
    startDate: r.start_date,
    duration: `${r.duration_value} ${r.duration_unit}`,
    location: r.location,
    hourlyRate: Number(r.hourly_rate_eur),
    meals: r.meal_bonus_eur ? Number(r.meal_bonus_eur) : null,
    bonuses: null,
    allowances: null,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    status: r.status,
    createdAt: r.created_at,
    candidates: [],
  }));

  // KPIs (sur l'ensemble, pas filtrés).
  const { data: allStatuses } = await supabase
    .from("requests")
    .select("status");
  const pendingCount = (allStatuses ?? []).filter((r) => r.status === "pending").length;
  const proposedCount = (allStatuses ?? []).filter((r) => r.status === "proposed").length;
  const validatedCount = (allStatuses ?? []).filter((r) => r.status === "validated").length;

  const firstName = (profile?.full_name ?? "").split(" ")[0] || "";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 animate-fade-up">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
            Tableau de bord
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
            Bonjour {firstName || "👋"}
          </h1>
          <p className="mt-2 text-neutral-600">
            Suivez vos demandes en cours et proposez-en de nouvelles en
            quelques clics.
          </p>
        </div>

        <Link
          href="/client/nouvelle-demande"
          className="group inline-flex items-center justify-center gap-3 self-start lg:self-auto rounded-[var(--radius-button)] bg-accent-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent-500/30 hover:bg-accent-600 hover:shadow-accent-500/40 hover:-translate-y-0.5 transition-all"
        >
          <svg
            className="h-5 w-5 transition-transform group-hover:rotate-90"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 4.5v11m-5.5-5.5h11"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          Nouvelle demande
        </Link>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-fade-up">
        <StatsTile
          label="En attente de profils"
          value={pendingCount}
          icon="clock"
          trend="Réponse sous 24h"
          color="accent"
        />
        <StatsTile
          label="Candidats à valider"
          value={proposedCount}
          icon="users"
          trend="Action requise"
          color="primary"
          href="/client?status=proposed"
        />
        <StatsTile
          label="Missions validées"
          value={validatedCount}
          icon="check"
          trend="Ce mois-ci"
          color="success"
        />
      </section>

      <section className="animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-primary-900">Mes demandes</h2>
          <RequestsFilter current={status} />
        </div>

        {requests.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center">
            <p className="text-neutral-500">
              {status === "all"
                ? "Vous n'avez pas encore de demande."
                : "Aucune demande dans cette catégorie."}
            </p>
            <Link
              href="/client/nouvelle-demande"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-accent-500"
            >
              Créer une demande →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req, index) => (
              <RequestCard key={req.id} request={req} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
