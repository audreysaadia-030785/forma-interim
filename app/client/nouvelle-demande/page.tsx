import Link from "next/link";

export default function ChooseRequestTypePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2">
        <Link href="/client" className="hover:text-primary-600 transition">
          Tableau de bord
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold">Nouvelle demande</span>
      </nav>

      <header className="mb-10 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Quel est votre besoin ?
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Choisissez le type de demande
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          ASCV CONSEILS vous accompagne sur trois domaines complémentaires.
          Sélectionnez celui qui correspond à votre besoin pour ouvrir le
          formulaire adapté.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ChoiceCard
          href="/client/nouvelle-demande/recrutement"
          available
          title="Recrutement"
          subtitle="CDD · CDI · Alternance · Stage"
          description="Trouvez le talent qui fera la différence dans votre équipe. Nous vous proposerons des candidats qualifiés correspondant à votre culture et vos exigences."
          icon="users"
          delay={0}
        />

        <ChoiceCard
          href="/client/nouvelle-demande/formation"
          available
          title="Formation"
          subtitle="Notre offre"
          description="Faites monter en compétences vos équipes : formations réglementaires, sécurité & prévention, développement de compétences, soft skills… ou toute autre demande que nous étudierons sur mesure."
          icon="academy"
          delay={120}
        />

        <ChoiceCard
          href="/client/nouvelle-demande/accompagnement-rh"
          available
          title="Accompagnement RH"
          subtitle="Conseil · Audit · Stratégie"
          description="Bénéficiez d'un accompagnement RH stratégique : structuration, gestion des talents, conduite du changement, audit social."
          icon="strategy"
          delay={240}
        />
      </div>
    </div>
  );
}

function ChoiceCard({
  href,
  title,
  subtitle,
  description,
  icon,
  available,
  delay,
}: {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  icon: "users" | "academy" | "strategy";
  available?: boolean;
  delay: number;
}) {
  const Icon = (
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-accent-700 shadow-sm">
      <RawIcon name={icon} />
    </span>
  );

  const content = (
    <article
      className={`group relative h-full rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 transition-all animate-fade-up ${
        available
          ? "hover:shadow-xl hover:ring-accent-300 hover:-translate-y-1 cursor-pointer"
          : "opacity-70 cursor-not-allowed"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {!available && (
        <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600 ring-1 ring-neutral-200">
          Bientôt disponible
        </span>
      )}
      {Icon}
      <h2 className="mt-4 text-xl font-extrabold text-primary-900">{title}</h2>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent-600">
        {subtitle}
      </p>
      <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
        {description}
      </p>
      {available && (
        <div className="mt-5 flex items-center gap-2 text-sm font-bold text-primary-700 group-hover:text-accent-600 transition-colors">
          Démarrer
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.5 10h11m0 0L10 4.5M15.5 10 10 15.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </article>
  );

  return available ? <Link href={href}>{content}</Link> : <div>{content}</div>;
}

function RawIcon({ name }: { name: "users" | "academy" | "strategy" }) {
  const props = {
    className: "h-7 w-7",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "users")
    return (
      <svg {...props}>
        <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="8" r="3.5" />
        <path d="M21 20v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 4.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  if (name === "academy")
    return (
      <svg {...props}>
        <path d="M12 3 2 8l10 5 10-5-10-5Z" />
        <path d="M6 10v6c0 1 2 3 6 3s6-2 6-3v-6" />
        <path d="M22 8v8" />
      </svg>
    );
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v9l6 3" />
      <path d="M16 21l-4-9" />
    </svg>
  );
}
