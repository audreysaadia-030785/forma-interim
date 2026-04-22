import { createClient } from "@/lib/supabase/server";
import { CandidatesHub } from "./candidates-hub";

export const dynamic = "force-dynamic";

export default async function AdminCandidatesPage() {
  const supabase = await createClient();
  const { data: candidates } = await supabase
    .from("candidates")
    .select(
      `id, first_name, last_name, headline, email, phone, location,
       primary_rome_code, primary_rome_label, experience_years,
       habilitations, permis, skills, tags, rating,
       available_from, cv_file_name, added_at`,
    )
    .order("added_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          CVthèque
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Vos candidats qualifiés
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Glissez-déposez un ou plusieurs CV PDF. Notre IA extrait
          automatiquement les informations (métier, habilitations, expérience,
          langues…). Vous relisez et enregistrez.
        </p>
      </header>

      <CandidatesHub initial={(candidates ?? []).map(dbToDisplay)} />
    </div>
  );
}

// Mapping snake_case -> camelCase pour le composant client.
function dbToDisplay(c: Record<string, unknown>) {
  return {
    id: c.id as string,
    firstName: (c.first_name as string) ?? "",
    lastName: (c.last_name as string) ?? "",
    headline: (c.headline as string) ?? "",
    email: (c.email as string) ?? null,
    phone: (c.phone as string) ?? null,
    location: (c.location as string) ?? null,
    primaryRomeCode: (c.primary_rome_code as string) ?? null,
    primaryRomeLabel: (c.primary_rome_label as string) ?? null,
    experienceYears: (c.experience_years as number) ?? null,
    habilitations: (c.habilitations as string[]) ?? [],
    permis: (c.permis as string[]) ?? [],
    skills: (c.skills as string[]) ?? [],
    tags: (c.tags as string[]) ?? [],
    rating: (c.rating as number) ?? null,
    availableFrom: (c.available_from as string) ?? null,
    cvFileName: (c.cv_file_name as string) ?? "",
    addedAt: (c.added_at as string) ?? "",
  };
}
