import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_CATEGORY_META, type HrDocument } from "@/lib/hr-types";
import { DocumentDownload } from "./document-download";

export const dynamic = "force-dynamic";

export default async function ClientRhBibliothequePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id")
    .eq("primary_user_id", user.id)
    .maybeSingle();
  if (!clientRow) return null;

  const { data: documents } = await supabase
    .from("hr_documents")
    .select("*")
    .or(`client_id.is.null,client_id.eq.${clientRow.id}`)
    .order("published_at", { ascending: false });

  const list = (documents ?? []) as HrDocument[];

  // Regrouper par catégorie
  const grouped = new Map<string, HrDocument[]>();
  for (const doc of list) {
    const k = doc.category ?? "autre";
    const arr = grouped.get(k);
    if (arr) arr.push(doc);
    else grouped.set(k, [doc]);
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold text-primary-900">
          Bibliothèque RH{" "}
          <span className="text-neutral-500 font-medium text-base">
            ({list.length})
          </span>
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          Retrouvez ici les modèles de contrats, procédures, veille juridique
          et autres ressources mises à votre disposition par ASCV CONSEILS.
        </p>
      </header>

      {list.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="text-neutral-500">
            Aucun document disponible pour l&apos;instant.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {[...grouped.entries()].map(([cat, docs]) => {
            const meta =
              DOCUMENT_CATEGORY_META[cat as keyof typeof DOCUMENT_CATEGORY_META] ??
              DOCUMENT_CATEGORY_META.autre;
            return (
              <section key={cat}>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-700">
                  <span className="text-lg">{meta.emoji}</span>
                  {meta.label}
                  <span className="text-neutral-500">({docs.length})</span>
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {docs.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-start gap-3 rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-4 hover:shadow-md transition"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 text-lg">
                        📄
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-primary-900">
                          {doc.title}
                        </p>
                        {doc.description && (
                          <p className="text-xs text-neutral-600 mt-0.5">
                            {doc.description}
                          </p>
                        )}
                        <p className="text-[10px] text-neutral-500 mt-1">
                          Publié le{" "}
                          {new Date(doc.published_at).toLocaleDateString(
                            "fr-FR",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                          {doc.client_id ? " · Personnalisé" : " · Partagé"}
                        </p>
                      </div>
                      <DocumentDownload id={doc.id} fileName={doc.file_name ?? "document"} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
