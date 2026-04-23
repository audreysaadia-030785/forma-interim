import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ASCV CONSEILS — Recrutement & conseil en stratégie",
  description:
    "Recruter avec stratégie, grandir avec excellence. Plateforme de recrutement CDD/CDI et de conseil en stratégie d'entreprise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-50 text-primary-900">
        {children}
      </body>
    </html>
  );
}
