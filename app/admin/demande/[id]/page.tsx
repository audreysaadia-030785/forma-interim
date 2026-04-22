import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DEMO_CANDIDATE_BASE,
  DEMO_REQUESTS,
  STATUS_META,
  formatDate,
} from "@/lib/demo-data";
import { ProposeCandidatesPanel } from "./propose-candidates-panel";

export default async function AdminRequestDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = DEMO_REQUESTS.find((r) => r.id === id);
  if (!request) notFound();

  const meta = STATUS_META[request.status];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2 flex-wrap">
        <Link href="/admin" className="hover:text-primary-600 transition">
          Demandes
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold truncate">
          {request.clientCompanyName} — {request.poste}
        </span>
      </nav>

      <header className="mb-6 rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 sm:p-8 animate-fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs font-mono text-neutral-500">{request.id}</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-bold text-primary-700">
                {request.clientCompanyName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-900">
              {request.poste}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Demande reçue le {formatDate(request.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPI label="Postes" value={request.headcount} />
          <KPI label="Démarrage" value={formatDate(request.startDate)} />
          <KPI label="Durée" value={request.duration} />
          <KPI label="Lieu" value={request.location} />
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6">
        <aside className="space-y-4">
          <InfoCard title="Rémunération proposée">
            <Row label="Taux horaire" value={`${request.hourlyRate.toFixed(2)} € brut/h`} highlight />
            <Row
              label="Panier"
              value={request.meals ? `${request.meals.toFixed(2)} €/jour` : "—"}
            />
            <Row label="Primes" value={request.bonuses ?? "—"} />
            <Row label="Indemnités" value={request.allowances ?? "—"} />
          </InfoCard>
          <InfoCard title="Contact client">
            <Row label="Entreprise" value={request.clientCompanyName} />
            <Row label="Nom" value={request.contactName} />
            <Row label="Email" value={request.contactEmail} />
            <Row label="Téléphone" value={request.contactPhone} />
          </InfoCard>
          {request.description && (
            <InfoCard title="Caractéristiques">
              <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {request.description}
              </p>
            </InfoCard>
          )}
        </aside>

        <ProposeCandidatesPanel
          requestId={request.id}
          alreadyProposed={request.candidates}
          candidateBase={DEMO_CANDIDATE_BASE}
        />
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-200">
      <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
        {label}
      </p>
      <p className="mt-0.5 font-bold text-primary-900 truncate">{value}</p>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 animate-fade-up">
      <h3 className="text-sm font-bold text-primary-900 mb-3 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-neutral-600">{label}</span>
      <span
        className={
          highlight
            ? "font-extrabold text-accent-600"
            : "font-semibold text-primary-900 text-right"
        }
      >
        {value}
      </span>
    </div>
  );
}
