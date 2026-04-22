import { DEMO_CLIENTS } from "@/lib/demo-data";
import { ClientsManager } from "./clients-manager";

export default function AdminClientsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8 animate-fade-up">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-2">
          Administration
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-900">
          Vos clients
        </h1>
        <p className="mt-2 text-neutral-600 max-w-2xl">
          Créez les comptes clients et gérez leur accès à la plateforme. Un
          email d'invitation leur sera envoyé avec leurs identifiants.
        </p>
      </header>

      <ClientsManager initial={DEMO_CLIENTS} />
    </div>
  );
}
