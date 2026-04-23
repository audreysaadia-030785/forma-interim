import Link from "next/link";

export default function AccompagnementRhComingSoon() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2 flex-wrap">
        <Link href="/client" className="hover:text-primary-600 transition">
          Tableau de bord
        </Link>
        <span>/</span>
        <Link href="/client/nouvelle-demande" className="hover:text-primary-600 transition">
          Nouvelle demande
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold">Accompagnement RH</span>
      </nav>

      <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-10 sm:p-14 text-center animate-fade-up">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-100 text-accent-700 shadow-md">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v9l6 3" />
            <path d="M16 21l-4-9" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-900">
          Module Accompagnement RH — Bientôt disponible
        </h1>
        <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
          Le formulaire dédié aux missions de conseil RH, audit social,
          structuration ou conduite du changement est en préparation. Vous
          pourrez bientôt formuler vos besoins en quelques clics.
        </p>
        <p className="mt-6 text-sm text-neutral-700">
          En attendant, contactez directement Audrey Saadia pour discuter de
          votre projet&nbsp;:{" "}
          <a
            href="mailto:contact.audreysaadia@gmail.com"
            className="font-semibold text-primary-700 hover:text-accent-600"
          >
            contact.audreysaadia@gmail.com
          </a>
        </p>
        <Link
          href="/client/nouvelle-demande"
          className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700 transition"
        >
          ← Choisir un autre type de demande
        </Link>
      </section>
    </div>
  );
}
