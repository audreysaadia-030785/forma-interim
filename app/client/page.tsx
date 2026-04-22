import Link from "next/link";
import { DEMO_REQUESTS, type RequestStatus } from "@/lib/demo-data";
import { RequestCard } from "../components/request-card";
import { StatsTile } from "../components/stats-tile";
import { RequestsFilter } from "../components/requests-filter";

export default async function ClientDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: RequestStatus | "all" }>;
}) {
  const { status = "all" } = await searchParams;

  const requests =
    status === "all"
      ? DEMO_REQUESTS
      : DEMO_REQUESTS.filter((r) => r.status === status);

  const pendingCount = DEMO_REQUESTS.filter(
    (r) => r.status === "pending",
  ).length;
  const proposedCount = DEMO_REQUESTS.filter(
    (r) => r.status === "proposed",
  ).length;
  const validatedCount = DEMO_REQUESTS.filter(
    (r) => r.status === "validated",
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      {/* En-tête — salutation + CTA */}
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 animate-fade-up">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
            Tableau de bord
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
            Bonjour Jean 👋
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

      {/* Statistiques */}
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

      {/* Liste des demandes */}
      <section className="animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-primary-900">Mes demandes</h2>
          <RequestsFilter current={status} />
        </div>

        {requests.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center">
            <p className="text-neutral-500">
              Aucune demande dans cette catégorie.
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
