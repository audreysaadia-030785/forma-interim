import Link from "next/link";
import { AccompagnementRhForm } from "./accompagnement-rh-form";

export default function AccompagnementRhRequestPage() {
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
        <span className="text-primary-700 font-semibold">Accompagnement RH</span>
      </nav>

      <header className="mb-6 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Conseil RH · Audit · Stratégie
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Demander un accompagnement RH
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Décrivez votre besoin : audit, structuration, gestion de conflit,
          plan de développement des compétences, conduite du changement…
          Nous revenons vers vous sous 48 h.
        </p>
      </header>

      <AccompagnementRhForm />
    </div>
  );
}
