import Link from "next/link";
import { RecruitmentForm } from "./recruitment-form";

export default function RecrutementPage() {
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
        <span className="text-primary-700 font-semibold">Recrutement</span>
      </nav>

      <header className="mb-8 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Recrutement CDD / CDI / Alternance / Stage
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Détaillez votre besoin de recrutement
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Renseignez le poste à pourvoir, le profil recherché et les
          conditions proposées. Nous vous présenterons rapidement les
          meilleurs candidats correspondant à votre culture d&apos;entreprise.
        </p>
      </header>

      <RecruitmentForm />
    </div>
  );
}
