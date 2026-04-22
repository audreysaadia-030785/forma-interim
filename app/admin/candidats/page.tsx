import { DEMO_CANDIDATE_BASE } from "@/lib/demo-data";
import { CandidatesManager } from "./candidates-manager";

export default function AdminCandidatesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Base candidats
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Vos candidats
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Ajoutez, recherchez et supprimez les CV de vos candidats. Conforme
          RGPD : suppression définitive en un clic.
        </p>
      </header>

      <CandidatesManager initial={DEMO_CANDIDATE_BASE} />
    </div>
  );
}
