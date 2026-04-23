import Link from "next/link";

export default function FormationComingSoon() {
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
        <span className="text-primary-700 font-semibold">Formation</span>
      </nav>

      <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-10 sm:p-14 text-center animate-fade-up">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-100 text-accent-700 shadow-md">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3 2 8l10 5 10-5-10-5Z" />
            <path d="M6 10v6c0 1 2 3 6 3s6-2 6-3v-6" />
            <path d="M22 8v8" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary-900">
          Module Formation — Bientôt disponible
        </h1>
        <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
          Nous mettons la dernière main à l&apos;espace de demande de formation.
          Vous pourrez bientôt commander des formations sur mesure ou choisir
          dans notre catalogue, en lien avec vos enjeux métier.
        </p>
        <p className="mt-6 text-sm text-neutral-700">
          En attendant, contactez directement Audrey Saadia pour discuter de
          votre besoin&nbsp;:{" "}
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
