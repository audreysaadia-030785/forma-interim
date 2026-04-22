import { createClient } from "@/lib/supabase/server";
import { CandidatesManager } from "./candidates-manager";

export const dynamic = "force-dynamic";

export default async function AdminCandidatesPage() {
  const supabase = await createClient();
  const { data: candidates } = await supabase
    .from("candidates")
    .select("id, first_name, last_name, headline, experience_years, cv_file_name, added_at")
    .order("added_at", { ascending: false });

  const rows = (candidates ?? []).map((c) => ({
    id: c.id,
    firstName: c.first_name,
    lastName: c.last_name,
    headline: c.headline ?? "",
    experienceYears: c.experience_years ?? 0,
    cvFileName: c.cv_file_name ?? "",
    addedAt: c.added_at,
  }));

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

      <CandidatesManager initial={rows} />
    </div>
  );
}
