"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DatePicker } from "@/app/components/date-picker";
import { submitFormationRequestAction } from "../actions";

const FINANCING_OPTIONS = [
  "OPCO",
  "CPF (Compte Personnel de Formation)",
  "Plan de développement des compétences (entreprise)",
  "Autofinancement",
  "FIF PL / FAF (professions libérales)",
  "Pôle Emploi / France Travail",
  "Autre (à préciser)",
];

const ACCOMMODATIONS_OPTIONS = [
  "Accès PMR (mobilité réduite)",
  "Supports adaptés (gros caractères, braille, audio…)",
  "Langue des signes (LSF) / interface communication",
  "Boucle magnétique / appareillage auditif",
  "Aménagement du temps de formation",
  "Pauses fréquentes / fractionnement de la formation",
  "Présence d'un accompagnant",
  "Salle calme / lumière adaptée",
  "Référent handicap dédié",
];

export function CustomFormationForm() {
  const router = useRouter();

  const [theme, setTheme] = useState("");
  const [objectives, setObjectives] = useState("");
  const [participants, setParticipants] = useState<number | "">("");
  const [level, setLevel] = useState("intermediaire");
  const [format, setFormat] = useState<"presentiel" | "distanciel" | "hybride">(
    "presentiel",
  );
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");

  const [pshPresent, setPshPresent] = useState(false);
  const [accommodations, setAccommodations] = useState<string[]>([]);
  const [accommodationsDetails, setAccommodationsDetails] = useState("");

  const [financingModes, setFinancingModes] = useState<string[]>([]);
  const [opcoName, setOpcoName] = useState("");
  const [financingOther, setFinancingOther] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [attachment, setAttachment] = useState<File | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, startSubmitting] = useTransition();

  function toggle(list: string[], setList: (v: string[]) => void, v: string) {
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }

  function handleFilePick(file: File | null) {
    if (!file) return setAttachment(null);
    if (file.size > 10 * 1024 * 1024) {
      alert("Fichier trop volumineux (max 10 Mo).");
      return;
    }
    setAttachment(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const fd = new FormData();
    fd.set("formationId", "custom");
    fd.set("formationTitle", theme || "Formation sur mesure");
    fd.set("formationCategory", "Sur mesure");
    fd.set("kind", "initiale");
    fd.set("objectives", objectives);
    if (participants) fd.set("participants", String(participants));
    fd.set("audienceLevel", level);
    fd.set("startDate", startDate);
    fd.set("format", format);
    if (location) fd.set("location", location);
    fd.set("pshPresent", pshPresent ? "true" : "false");
    fd.set("accommodations", JSON.stringify(accommodations));
    if (accommodationsDetails)
      fd.set("accommodationsDetails", accommodationsDetails);
    fd.set("financingModes", JSON.stringify(financingModes));
    if (opcoName) fd.set("opcoName", opcoName);
    if (financingOther) fd.set("financingOther", financingOther);
    fd.set("contactName", contactName);
    fd.set("contactEmail", contactEmail);
    fd.set("contactPhone", contactPhone);
    if (attachment) fd.set("attachment", attachment);

    startSubmitting(async () => {
      const res = await submitFormationRequestAction(fd);
      if (res && !res.ok) setSubmitError(res.error ?? "Erreur inconnue");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section index={1} title="Thématique de la formation" subtitle="Que souhaitez-vous faire apprendre ?">
        <FieldGroup>
          <Label htmlFor="theme" required>Intitulé / thématique</Label>
          <input
            id="theme"
            required
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex. Gestion du stress pour encadrants commerciaux"
            className={inputClass}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="objectives" required>Objectifs visés</Label>
          <textarea
            id="objectives"
            required
            rows={4}
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            placeholder="Décrivez précisément les enjeux, les résultats attendus, le contexte métier, les contraintes particulières…"
            className={`${inputClass} resize-y min-h-[120px]`}
          />
        </FieldGroup>
      </Section>

      <Section index={2} title="Participants" delay={80}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldGroup>
            <Label htmlFor="participants" required>Nombre de participants</Label>
            <input
              id="participants"
              type="number"
              min={1}
              max={50}
              required
              value={participants}
              onChange={(e) =>
                setParticipants(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="8"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Niveau du public</Label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { v: "debutant", l: "Débutant" },
                { v: "intermediaire", l: "Intermédiaire" },
                { v: "avance", l: "Avancé" },
                { v: "mixte", l: "Mixte" },
              ].map((o) => {
                const active = level === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setLevel(o.v)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      active
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-white ring-1 ring-neutral-300 text-neutral-700 hover:bg-primary-50 hover:ring-primary-300"
                    }`}
                  >
                    {o.l}
                  </button>
                );
              })}
            </div>
          </FieldGroup>
        </div>
      </Section>

      <Section index={3} title="Date & format" delay={160}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldGroup>
            <Label htmlFor="startDate">Date souhaitée <span className="text-neutral-500 font-normal">(indicative)</span></Label>
            <DatePicker
              id="startDate"
              value={startDate}
              onChange={setStartDate}
              placeholder="Choisir une date"
            />
          </FieldGroup>
          <FieldGroup>
            <Label required>Format souhaité</Label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { v: "presentiel" as const, l: "🏢 Présentiel" },
                { v: "distanciel" as const, l: "💻 Distanciel (nous contacter)" },
                { v: "hybride" as const, l: "🔄 Hybride (nous contacter)" },
              ].map((o) => {
                const active = format === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setFormat(o.v)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      active
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-white ring-1 ring-neutral-300 text-neutral-700 hover:bg-primary-50 hover:ring-primary-300"
                    }`}
                  >
                    {o.l}
                  </button>
                );
              })}
            </div>
          </FieldGroup>
          {format === "presentiel" && (
            <FieldGroup className="md:col-span-2">
              <Label htmlFor="location">Lieu</Label>
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex. 12 rue de la Paix, 75002 Paris"
                className={inputClass}
              />
            </FieldGroup>
          )}
        </div>
      </Section>

      <Section index={4} title="Aménagements & accessibilité" delay={240}>
        <label className="flex items-center gap-3 rounded-[var(--radius-button)] bg-primary-50/40 ring-1 ring-primary-200 px-4 py-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={pshPresent}
            onChange={(e) => setPshPresent(e.target.checked)}
            className="h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <div>
            <p className="text-sm font-bold text-primary-900">Présence d&apos;une ou plusieurs personnes en situation de handicap</p>
            <p className="text-xs text-neutral-600">Aménagements prévus en amont le cas échéant.</p>
          </div>
        </label>
        {pshPresent && (
          <>
            <FieldGroup>
              <Label>Aménagements à prévoir</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-[var(--radius-button)] bg-neutral-50/70 ring-1 ring-neutral-200 p-3">
                {ACCOMMODATIONS_OPTIONS.map((a) => {
                  const checked = accommodations.includes(a);
                  return (
                    <label
                      key={a}
                      className={`flex items-start gap-2.5 rounded-lg px-3 py-1.5 text-sm cursor-pointer select-none transition-all ${
                        checked
                          ? "bg-primary-50 ring-1 ring-primary-300 text-primary-900 font-semibold"
                          : "hover:bg-white text-neutral-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(accommodations, setAccommodations, a)}
                        className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span>{a}</span>
                    </label>
                  );
                })}
              </div>
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="accommodationsDetails">Précisions complémentaires</Label>
              <textarea
                id="accommodationsDetails"
                rows={3}
                value={accommodationsDetails}
                onChange={(e) => setAccommodationsDetails(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </FieldGroup>
          </>
        )}
      </Section>

      <Section index={5} title="Financement" delay={320}>
        <FieldGroup>
          <Label>Mode(s) de financement envisagé(s)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-[var(--radius-button)] bg-neutral-50/70 ring-1 ring-neutral-200 p-3">
            {FINANCING_OPTIONS.map((f) => {
              const checked = financingModes.includes(f);
              return (
                <label
                  key={f}
                  className={`flex items-start gap-2.5 rounded-lg px-3 py-1.5 text-sm cursor-pointer select-none transition-all ${
                    checked
                      ? "bg-primary-50 ring-1 ring-primary-300 text-primary-900 font-semibold"
                      : "hover:bg-white text-neutral-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(financingModes, setFinancingModes, f)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>{f}</span>
                </label>
              );
            })}
          </div>
        </FieldGroup>
        {financingModes.includes("OPCO") && (
          <FieldGroup>
            <Label htmlFor="opcoName">Nom de l&apos;OPCO</Label>
            <input
              id="opcoName"
              value={opcoName}
              onChange={(e) => setOpcoName(e.target.value)}
              placeholder="Ex. Constructys, AKTO, OPCO EP, Atlas…"
              className={inputClass}
            />
          </FieldGroup>
        )}
        {financingModes.includes("Autre (à préciser)") && (
          <FieldGroup>
            <Label htmlFor="financingOther">Précisez</Label>
            <input
              id="financingOther"
              value={financingOther}
              onChange={(e) => setFinancingOther(e.target.value)}
              className={inputClass}
            />
          </FieldGroup>
        )}
      </Section>

      <Section index={6} title="Contact" delay={400}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup>
            <Label htmlFor="contactName" required>Nom</Label>
            <input id="contactName" required value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="contactEmail" required>Email</Label>
            <input id="contactEmail" type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClass} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="contactPhone" required>Téléphone</Label>
            <input id="contactPhone" type="tel" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={inputClass} />
          </FieldGroup>
        </div>
      </Section>

      <Section index={7} title="Pièce jointe (optionnel)" delay={480}>
        {attachment ? (
          <div className="flex items-center gap-3 rounded-[var(--radius-button)] bg-emerald-50 ring-1 ring-emerald-200 p-3">
            <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 12.5 9.5 18 20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="flex-1 text-sm text-primary-900 font-semibold truncate">{attachment.name}</span>
            <button type="button" onClick={() => setAttachment(null)} className="rounded-full p-1.5 text-neutral-500 hover:bg-white hover:text-rose-600 transition" aria-label="Retirer">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" /></svg>
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-3 rounded-[var(--radius-button)] border-2 border-dashed border-primary-300 bg-primary-50/40 px-4 py-4 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
            <svg className="h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zm0 0v5h5" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold text-primary-700">Cahier des charges, brief, ou tout document utile</span>
            <input type="file" accept=".pdf,.doc,.docx,image/*" className="sr-only" onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)} />
          </label>
        )}
      </Section>

      {submitError && (
        <div className="rounded-[var(--radius-card)] bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          <strong>Impossible d&apos;envoyer la demande.</strong><br />{submitError}
        </div>
      )}

      <div className="sticky bottom-4 flex flex-col-reverse sm:flex-row gap-3 justify-end bg-white/90 backdrop-blur rounded-[var(--radius-card)] ring-1 ring-neutral-200 shadow-lg p-3">
        <button type="button" onClick={() => router.push("/client/nouvelle-demande/formation")} className="rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50 transition">
          Retour au catalogue
        </button>
        <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 disabled:opacity-70 transition-all">
          {submitting ? "Envoi…" : "Envoyer la demande"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white px-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15";

function Section({ index, title, subtitle, delay = 0, children }: { index: number; title: string; subtitle?: string; delay?: number; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 sm:p-6 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <header className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white font-bold shadow-md shadow-primary-600/20">{index}</span>
        <div>
          <h2 className="text-base font-bold text-primary-900">{title}</h2>
          {subtitle && <p className="text-xs text-neutral-600">{subtitle}</p>}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1 ${className ?? ""}`}>{children}</div>;
}

function Label({ htmlFor, required, children }: { htmlFor?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold text-primary-900 flex items-center gap-1">
      {children}
      {required && <span className="text-accent-500">*</span>}
    </label>
  );
}
