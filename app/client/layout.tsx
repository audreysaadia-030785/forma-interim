import type { Metadata } from "next";
import { Topbar } from "../components/topbar";

export const metadata: Metadata = {
  title: "Espace client — Forma Interim",
};

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex-1 flex flex-col bg-neutral-50">
      <Topbar role="client" userName="Jean Martin" userCompany="Acme BTP" />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-neutral-500 flex flex-col sm:flex-row gap-2 sm:justify-between items-center">
          <span>
            © {new Date().getFullYear()} Forma Interim — Votre talent, notre
            mission
          </span>
          <span className="flex items-center gap-4">
            <a
              href="#"
              className="hover:text-primary-600 transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="hover:text-primary-600 transition-colors"
            >
              Politique de confidentialité
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
