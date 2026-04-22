import Link from "next/link";
import { LoginForm } from "./(auth)/login-form";
import { BrandMark } from "./components/brand-mark";

export default function LoginPage() {
  return (
    <main className="flex flex-1 min-h-screen">
      {/* Hero gauche — visible à partir de lg */}
      <aside className="hidden lg:flex lg:w-1/2 bg-brand-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent-500/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-primary-300/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <BrandMark variant="light" size="xl" />

          <div className="max-w-md space-y-6 animate-fade-up">
            <h1 className="text-4xl xl:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Votre talent,
              <br />
              <span className="text-accent-300">notre mission.</span>
            </h1>
            <p className="text-primary-100 text-lg leading-relaxed">
              Déposez vos demandes de personnel intérimaire en quelques
              secondes. Nous vous proposons les meilleurs candidats, vous
              validez.
            </p>

            <ul className="flex flex-col gap-3 pt-4">
              {["Rapidité", "Suivi en temps réel", "Candidats qualifiés"].map(
                (label, index) => (
                  <li
                    key={label}
                    className="group inline-flex items-center gap-3 self-start rounded-full bg-white/10 backdrop-blur px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 shadow-lg shadow-primary-900/10 cursor-default animate-slide-in hover:bg-white/20 hover:ring-accent-400/50 hover:scale-[1.06] hover:-translate-y-0.5 transition-all duration-300 ease-out"
                    style={{ animationDelay: `${index * 180 + 200}ms` }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500/90 text-white shadow-lg shadow-accent-500/25 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:bg-accent-400">
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          d="M4.5 10h11m0 0L10 4.5M15.5 10 10 15.5"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="tracking-wide">{label}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <p className="text-sm text-primary-200/80">
            © {new Date().getFullYear()} Forma Interim — Tous droits réservés
          </p>
        </div>
      </aside>

      {/* Colonne formulaire */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden mb-8 flex justify-center">
            <BrandMark variant="dark" size="lg" />
          </div>

          <div className="bg-white rounded-[var(--radius-card)] shadow-xl shadow-primary-900/5 ring-1 ring-neutral-200/70 p-8 sm:p-10">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-primary-900">
                Bon retour 👋
              </h2>
              <p className="mt-2 text-neutral-600 text-sm">
                Connectez-vous pour accéder à votre espace.
              </p>
            </header>

            <LoginForm />

            <p className="mt-8 text-center text-sm text-neutral-600">
              Pas encore de compte ?{" "}
              <Link
                href="mailto:contact@forma-interim.fr"
                className="font-medium text-primary-600 hover:text-accent-500 transition-colors"
              >
                Contactez-nous
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-500">
            En vous connectant, vous acceptez nos conditions d&apos;utilisation
            et notre politique de confidentialité.
          </p>
        </div>
      </section>
    </main>
  );
}
