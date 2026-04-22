import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STATUS_META, formatDate, type RequestStatus } from "@/lib/demo-data";
import { CandidatesPanel } from "./candidates-panel";
import { CancelRequestButton } from "./cancel-request-button";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("requests")
    .select(
      `id, reference, job_label, rome_code, headcount, start_date, duration_value, duration_unit, location,
       hourly_rate_eur, meal_bonus_eur, travel_bonus_eur, transport_allowance_eur, other_premium,
       contact_name, contact_email, contact_phone, description, status, created_at`,
    )
    .eq("id", id)
    .single();

  if (!request) notFound();

  const meta = STATUS_META[request.status as RequestStatus];

  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, status, candidates(id, first_name, last_name, headline)")
    .eq("request_id", id);

  const candidatesForPanel = (proposals ?? []).map((p) => ({
    proposalId: p.id,
    status: p.status as "pending" | "validated" | "refused",
    // @ts-expect-error relation
    fullName: `${p.candidates?.first_name ?? ""} ${p.candidates?.last_name ?? ""}`.trim(),
    // @ts-expect-error relation
    headline: p.candidates?.headline ?? "",
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2 flex-wrap">
        <Link href="/client" className="hover:text-primary-600 transition">
          Tableau de bord
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold truncate">
          {request.job_label}
        </span>
      </nav>

      <header className="mb-8 rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 sm:p-8 animate-fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs font-mono text-neutral-500">
                {request.reference}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary-900">
              {request.job_label}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Demande créée le {formatDate(request.created_at)}
            </p>
          </div>

          {(request.status === "pending" || request.status === "proposed") && (
            <CancelRequestButton requestId={request.id} />
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KPI label="Postes" value={request.headcount} />
          <KPI label="Démarrage" value={formatDate(request.start_date)} />
          <KPI
            label="Durée"
            value={`${request.duration_value} ${request.duration_unit}`}
          />
          <KPI label="Lieu" value={request.location} />
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
        <aside className="space-y-6">
          <InfoCard title="Rémunération">
            <Row
              label="Taux horaire"
              value={`${Number(request.hourly_rate_eur).toFixed(2)} € brut/h`}
              highlight
            />
            <Row
              label="Prime repas"
              value={
                request.meal_bonus_eur
                  ? `${Number(request.meal_bonus_eur).toFixed(2)} €/jour`
                  : "—"
              }
            />
            <Row
              label="Prime trajet"
              value={
                request.travel_bonus_eur
                  ? `${Number(request.travel_bonus_eur).toFixed(2)} €/jour`
                  : "—"
              }
            />
            <Row
              label="Indemnité transport"
              value={
                request.transport_allowance_eur
                  ? `${Number(request.transport_allowance_eur).toFixed(2)} €/jour`
                  : "—"
              }
            />
            <Row label="Autre" value={request.other_premium ?? "—"} />
          </InfoCard>

          <InfoCard title="Contact">
            <Row label="Nom" value={request.contact_name} />
            <Row label="Email" value={request.contact_email} />
            <Row label="Téléphone" value={request.contact_phone} />
          </InfoCard>

          {request.description && (
            <InfoCard title="Caractéristiques">
              <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {request.description}
              </p>
            </InfoCard>
          )}
        </aside>

        <CandidatesPanel
          requestStatus={request.status as RequestStatus}
          proposals={candidatesForPanel}
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
    <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 animate-fade-up">
      <h3 className="text-sm font-bold text-primary-900 mb-3 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
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
    <div className="flex items-center justify-between gap-3 text-sm">
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
