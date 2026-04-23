import Link from "next/link";
import { notFound } from "next/navigation";
import { FORMATIONS } from "@/lib/formations-catalog";
import { styleFor } from "@/lib/formation-icons";
import { createServiceClient } from "@/lib/supabase/server";
import { FormationRequestForm } from "./formation-request-form";
import { ProgramDownload } from "./program-download";

export default async function FormationRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kind?: "initiale" | "recyclage" }>;
}) {
  const { id } = await params;
  const { kind } = await searchParams;
  const formation = FORMATIONS.find((f) => f.id === id);
  if (!formation) notFound();

  const style = styleFor(formation.category);

  // Vérifie si un programme PDF existe dans Supabase Storage pour cette formation.
  // Convention : bucket "formation-programs", fichier nommé `<id>.pdf`.
  let programPath: string | null = null;
  try {
    const admin = createServiceClient();
    const { data } = await admin.storage
      .from("formation-programs")
      .list("", { search: `${formation.id}.pdf` });
    if (data?.some((f) => f.name === `${formation.id}.pdf`)) {
      programPath = `${formation.id}.pdf`;
    }
  } catch {
    // Bucket inexistant ou erreur — on continue sans PDF.
    programPath = null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2 flex-wrap">
        <Link href="/client" className="hover:text-primary-600 transition">
          Tableau de bord
        </Link>
        <span>/</span>
        <Link
          href="/client/nouvelle-demande"
          className="hover:text-primary-600 transition"
        >
          Nouvelle demande
        </Link>
        <span>/</span>
        <Link
          href="/client/nouvelle-demande/formation"
          className="hover:text-primary-600 transition"
        >
          Notre offre
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold truncate">
          {formation.title}
        </span>
      </nav>

      {/* En-tête formation sélectionnée */}
      <header className="mb-6 rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 sm:p-8 animate-fade-up">
        <div className="flex items-start gap-4 flex-wrap">
          <span
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-sm ${style.iconBgClass}`}
          >
            {style.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${style.badgeClass}`}
              >
                {formation.category}
              </span>
              <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-[11px] font-bold text-primary-700 ring-1 ring-primary-200">
                {formation.superCategory}
              </span>
              {formation.hasRecyclage && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                  ↻ Recyclage disponible
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-900 leading-tight">
              {formation.title}
            </h1>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <ProgramDownload programPath={programPath} />
        </div>

        <div className="mt-5 rounded-xl bg-primary-50/60 ring-1 ring-primary-200 p-4 text-sm text-primary-900 leading-relaxed">
          📅 <strong>Calendrier :</strong> ajusté ensemble selon vos
          contraintes — <em>nous consulter</em>.
          <br />
          💼 <strong>Devis :</strong> transmis sous{" "}
          <strong>48&nbsp;heures maximum</strong> après réception de votre
          demande.
        </div>
      </header>

      <FormationRequestForm
        formationId={formation.id}
        formationTitle={formation.title}
        formationCategory={formation.category}
        defaultKind={kind}
      />
    </div>
  );
}
