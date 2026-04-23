import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { type HrDocument } from "@/lib/hr-types";
import { DocumentsManager } from "./documents-manager";

export const dynamic = "force-dynamic";

export default async function AdminRhDocumentsPage() {
  const supabase = await createClient();

  const { data: docs } = await supabase
    .from("hr_documents")
    .select("*")
    .order("published_at", { ascending: false });

  const { data: clients } = await supabase
    .from("clients")
    .select("id, company_name")
    .order("company_name");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6 text-sm text-neutral-500 flex items-center gap-2">
        <Link href="/admin" className="hover:text-primary-600 transition">
          Demandes
        </Link>
        <span>/</span>
        <Link href="/admin/rh" className="hover:text-primary-600 transition">
          RH
        </Link>
        <span>/</span>
        <span className="text-primary-700 font-semibold">Bibliothèque</span>
      </nav>

      <header className="mb-6 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Accompagnement RH
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Bibliothèque documents
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Publiez des documents qui seront visibles par vos clients dans leur
          espace « Mon RH » → « Bibliothèque ».
        </p>
      </header>

      <DocumentsManager
        documents={(docs ?? []) as HrDocument[]}
        clients={(clients ?? []).map((c) => ({ id: c.id, name: c.company_name }))}
      />
    </div>
  );
}
