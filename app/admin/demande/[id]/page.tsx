import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STATUS_META, formatDate, type RequestStatus } from "@/lib/demo-data";
import { rankCandidates, type MatchInputCandidate } from "@/lib/matching";
import { ProposeCandidatesPanel } from "./propose-candidates-panel";

export const dynamic = "force-dynamic";

export default async function AdminRequestDetail({
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
       contact_name, contact_email, contact_phone, description, habilitations, custom_habilitations,
       job_spec_path, status, created_at,
       clients(id, company_name)`,
    )
    .eq("id", id)
    .single();

  if (!request) notFound();

  const meta = STATUS_META[request.status as RequestStatus];

  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, status, candidate_id")
    .eq("request_id", id);

  const alreadyProposedIds = (proposals ?? []).map((p) => p.candidate_id);

  // Charge la base candidats complète pour faire le scoring.
  const { data: candidateBase } = await supabase
    .from("candidates")
    .select(
      `id, first_name, last_name, headline, cv_file_name,
       primary_rome_code, primary_rome_label, secondary_rome_codes,
       habilitations, permis, experience_years,
       location, available_from,
       expected_hourly_rate_min_eur, expected_hourly_rate_max_eur,
       tags, rating`,
    )
    .order("added_at", { ascending: false });

  // Calcule les scores.
  const matchingInputs: MatchInputCandidate[] = (candidateBase ?? []).map(
    (c) => ({
      id: c.id,
      primaryRomeCode: c.primary_rome_code,
      secondaryRomeCodes: c.secondary_rome_codes ?? [],
      habilitations: c.habilitations ?? [],
      experienceYears: c.experience_years,
      location: c.location,
      availableFrom: c.available_from,
      expectedHourlyRateMinEur: c.expected_hourly_rate_min_eur
        ? Number(c.expected_hourly_rate_min_eur)
        : null,
      expectedHourlyRateMaxEur: c.expected_hourly_rate_max_eur
        ? Number(c.expected_hourly_rate_max_eur)
        : null,
    }),
  );

  const allRequiredHabilitations = [
    ...(request.habilitations ?? []),
    ...(request.custom_habilitations ?? []),
  ];

  const matches = rankCandidates(
    {
      romeCode: request.rome_code,
      habilitations: allRequiredHabilitations,
      location: request.location,
      startDate: request.start_date,
      hourlyRateEur: Number(request.hourly_rate_eur),
    },
    matchingInputs,
  );

  // Fusionne les infos candidat + score pour le panel.
  const candidatesWithScore = matches.map((m) => {
    const candidate = (candidateBase ?? []).find((c) => c.id === m.candidateId)!;
    return {
      id: candidate.id,
      firstName: candidate.first_name,
      lastName: candidate.last_name,
      headline: candidate.headline ?? "",
      cvFileName: candidate.cv_file_name ?? "",
      primaryRomeCode: candidate.primary_rome_code,
      primaryRomeLabel: candidate.primary_rome_label,
      experienceYears: candidate.experience_years,
      habilitations: candidate.habilitations ?? [],
      location: candidate.location,
      availableFrom: candidate.available_from,
      rating: candidate.rating,
      tags: candidate.tags ?? [],
      score: m.score,
      breakdown: m.breakdown,
      reasons: m.reasons,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2 flex-wrap">
        <Link href="/admin" className="hover:text-primary-600 transition">
          Demandes
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold truncate">
          {
            // @ts-expect-error relation
            request.clients?.company_name
          }{" "}
          — {request.job_label}
        </span>
      </nav>

      <header className="mb-6 rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 sm:p-8 animate-fade-up">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs font-mono text-neutral-500">{request.reference}</span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-2.5 py-1 text-xs font-bold text-primary-700">
                {
                  // @ts-expect-error relation
                  request.clients?.company_name
                }
              </span>
              {request.rome_code && (
                <span className="inline-flex items-center rounded-md bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold text-white font-mono">
                  {request.rome_code}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-900">
              {request.job_label}
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Demande reçue le {formatDate(request.created_at)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPI label="Postes" value={request.headcount} />
          <KPI label="Démarrage" value={formatDate(request.start_date)} />
          <KPI
            label="Durée"
            value={`${request.duration_value} ${request.duration_unit}`}
          />
          <KPI label="Lieu" value={request.location} />
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6">
        <aside className="space-y-4">
          <InfoCard title="Rémunération proposée">
            <Row label="Taux horaire" value={`${Number(request.hourly_rate_eur).toFixed(2)} € brut/h`} highlight />
            <Row label="Prime repas" value={request.meal_bonus_eur ? `${Number(request.meal_bonus_eur).toFixed(2)} €/jour` : "—"} />
            <Row label="Prime trajet" value={request.travel_bonus_eur ? `${Number(request.travel_bonus_eur).toFixed(2)} €/jour` : "—"} />
            <Row label="Indemnité transport" value={request.transport_allowance_eur ? `${Number(request.transport_allowance_eur).toFixed(2)} €/jour` : "—"} />
            <Row label="Autre" value={request.other_premium ?? "—"} />
          </InfoCard>

          <InfoCard title="Contact client">
            <Row
              label="Entreprise"
              value={
                // @ts-expect-error relation
                request.clients?.company_name ?? ""
              }
            />
            <Row label="Nom" value={request.contact_name} />
            <Row label="Email" value={request.contact_email} />
            <Row label="Téléphone" value={request.contact_phone} />
          </InfoCard>

          {allRequiredHabilitations.length > 0 && (
            <InfoCard title="Habilitations requises">
              <ul className="flex flex-wrap gap-1.5">
                {allRequiredHabilitations.map((h: string) => (
                  <li
                    key={h}
                    className="inline-flex rounded-full bg-primary-50 ring-1 ring-primary-200 px-2.5 py-1 text-xs font-semibold text-primary-800"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}

          {request.description && (
            <InfoCard title="Caractéristiques">
              <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {request.description}
              </p>
            </InfoCard>
          )}

          {request.job_spec_path && (
            <InfoCard title="Fiche de poste">
              <a
                href={`/api/job-spec?path=${encodeURIComponent(request.job_spec_path)}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-accent-500 transition"
              >
                Télécharger la pièce jointe
              </a>
            </InfoCard>
          )}
        </aside>

        <ProposeCandidatesPanel
          requestId={request.id}
          alreadyProposedIds={alreadyProposedIds}
          candidates={candidatesWithScore}
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
