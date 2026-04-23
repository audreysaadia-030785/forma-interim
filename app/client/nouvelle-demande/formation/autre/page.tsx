import Link from "next/link";
import { CustomFormationForm } from "./custom-formation-form";

export default function CustomFormationRequestPage() {
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
        <span className="text-primary-700 font-semibold">Formation sur mesure</span>
      </nav>

      <header className="mb-6 rounded-[var(--radius-card)] bg-gradient-to-br from-accent-50 via-white to-primary-50 ring-1 ring-accent-200 shadow-sm p-6 sm:p-8 animate-fade-up">
        <div className="flex items-start gap-4 flex-wrap">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-3xl shadow-md">
            ✨
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-900 leading-tight">
              Formation sur mesure
            </h1>
            <p className="mt-2 text-sm text-neutral-700">
              Décrivez-nous précisément votre besoin de formation. Nous
              étudions chaque demande et, si c&apos;est pertinent, nous
              créerons la formation correspondante et l&apos;intégrerons à
              notre offre.
            </p>
          </div>
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

      <CustomFormationForm />
    </div>
  );
}
