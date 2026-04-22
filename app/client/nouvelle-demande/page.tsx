import Link from "next/link";
import { NewRequestForm } from "./new-request-form";

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2">
        <Link href="/client" className="hover:text-primary-600 transition">
          Tableau de bord
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold">Nouvelle demande</span>
      </nav>

      <header className="mb-8 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Faire une demande
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Créer une nouvelle demande
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Remplissez les informations ci-dessous — nous vous proposerons
          rapidement les profils les plus adaptés à votre mission.
        </p>
      </header>

      <NewRequestForm />
    </div>
  );
}
