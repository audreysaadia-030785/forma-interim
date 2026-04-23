import Link from "next/link";
import { notFound } from "next/navigation";
import { FORMATIONS } from "@/lib/formations-catalog";
import { styleFor } from "@/lib/formation-icons";
import { FormationRequestForm } from "./formation-request-form";

export default async function FormationRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const formation = FORMATIONS.find((f) => f.id === id);
  if (!formation) notFound();

  const style = styleFor(formation.category);

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
          Catalogue
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
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${style.badgeClass}`}
            >
              {formation.category}
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-900 leading-tight">
              {formation.title}
            </h1>
            {formation.durationHint && (
              <p className="mt-1 text-sm text-neutral-600">
                ⏱ Durée indicative : <strong>{formation.durationHint}</strong>
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-primary-50/60 ring-1 ring-primary-200 p-4 text-sm text-primary-900 leading-relaxed">
          📅 <strong>Calendrier :</strong> ajusté ensemble selon vos contraintes —{" "}
          <em>nous consulter</em>.<br />
          💼 <strong>Devis :</strong> transmis sous{" "}
          <strong>48 heures maximum</strong> après réception de votre demande.
        </div>
      </header>

      <FormationRequestForm
        formationId={formation.id}
        formationTitle={formation.title}
        formationCategory={formation.category}
      />
    </div>
  );
}
