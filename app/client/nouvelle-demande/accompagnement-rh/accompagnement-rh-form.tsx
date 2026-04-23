"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DatePicker } from "@/app/components/date-picker";
import { submitAccompagnementRhAction } from "./actions";

const MISSION_TYPES = [
  { key: "audit", label: "Audit / Diagnostic RH", emoji: "🔍" },
  { key: "structuration", label: "Structuration RH / mise en place", emoji: "🏗️" },
  { key: "plan_competences", label: "Plan de développement des compétences", emoji: "📊" },
  { key: "conduite_changement", label: "Conduite du changement", emoji: "🔄" },
  { key: "gestion_conflit", label: "Gestion de conflit", emoji: "🤝" },
  { key: "rupture_contrat", label: "Rupture de contrat / licenciement", emoji: "📄" },
  { key: "entretiens", label: "Accompagnement entretiens (annuels, pro)", emoji: "💬" },
  { key: "conseil_strategique", label: "Conseil stratégique RH", emoji: "🎯" },
  { key: "autre", label: "Autre (à préciser)", emoji: "✨" },
];

const COMPANY_SIZES = [
  { key: "tpe", label: "TPE (< 10)" },
  { key: "pme", label: "PME (10-250)" },
  { key: "eti", label: "ETI (250-5000)" },
  { key: "ge", label: "Grande entreprise (5000+)" },
];

const URGENCY = [
  { key: "asap", label: "🔥 Très urgent (< 1 semaine)" },
  { key: "high", label: "⚡ Urgent (1-4 semaines)" },
  { key: "normal", label: "📅 Normal (1-3 mois)" },
  { key: "planning", label: "📆 À planifier (> 3 mois)" },
];

export function AccompagnementRhForm() {
  const router = useRouter();

  const [missionTypes, setMissionTypes] = useState<string[]>([]);
  const [missionOther, setMissionOther] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [startDate, setStartDate] = useState("");
  const [durationWeeks, setDurationWeeks] = useState<number | "">("");
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [budget, setBudget] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, startSubmitting] = useTransition();

  function toggleMission(k: string) {
    setMissionTypes((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
    );
  }

  function handleFilePick(file: File | null) {
    if (!file) return setAttachment(null);
    if (file.size > 10 * 1024 * 1024) {
      alert("Fichier trop volumineux (max 10 Mo).");
      return;
    }
    setAttachment(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    if (missionTypes.length === 0) {
      setSubmitError("Sélectionnez au moins un type de mission.");
      return;
    }

    const fd = new FormData();
    fd.set("missionTypes", JSON.stringify(missionTypes));
    if (missionOther) fd.set("missionOther", missionOther);
    fd.set("description", description);
    fd.set("urgency", urgency);
    if (startDate) fd.set("startDate", startDate);
    if (durationWeeks) fd.set("durationWeeks", String(durationWeeks));
    if (companySize) fd.set("companySize", companySize);
    if (location) fd.set("location", location);
    fd.set("remote", remote ? "true" : "false");
    if (budget) fd.set("budget", budget);
    fd.set("contactName", contactName);
    fd.set("contactEmail", contactEmail);
    fd.set("contactPhone", contactPhone);
    if (attachment) fd.set("attachment", attachment);

    startSubmitting(async () => {
      const res = await submitAccompagnementRhAction(fd);
      if (res && !res.ok) setSubmitError(res.error ?? "Erreur inconnue");
    });
  }

  const otherSelected = missionTypes.includes("autre");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECTION 1 — Type de mission */}
      <Section index={1} title="Type de mission" subtitle="Sélectionnez un ou plusieurs besoins">
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {MISSION_TYPES.map((m) => {
              const active = missionTypes.includes(m.key);
              return (
                <label
                  key={m.key}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer select-none transition ${
                    active
                      ? "bg-primary-50 ring-1 ring-primary-300 text-primary-900 font-semibold"
                      : "bg-white ring-1 ring-neutral-200 text-neutral-700 hover:bg-primary-50/50 hover:ring-primary-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleMission(m.key)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="flex-1">
                    <span className="text-base mr-1">{m.emoji}</span>
                    {m.label}
                  </span>
                </label>
              );
            })}
          </div>
        </FieldGroup>

        {otherSelected && (
          <FieldGroup>
            <Label htmlFor="missionOther" required>Précisez votre besoin</Label>
            <input
              id="missionOther"
              required
              value={missionOther}
              onChange={(e) => setMissionOther(e.target.value)}
              placeholder="Décrivez en une phrase le type de mission souhaité"
              className={inputClass}
            />
          </FieldGroup>
        )}
      </Section>

      {/* SECTION 2 — Description du besoin */}
      <Section index={2} title="Description du besoin" delay={80}>
        <FieldGroup>
          <Label htmlFor="description" required>Décrivez votre contexte & vos enjeux</Label>
          <textarea
            id="description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex. Nous avons 35 salariés et nous souhaitons mettre en place des entretiens professionnels structurés. Nous n'avons pas de DRH en interne et cherchons un accompagnement sur 3 mois pour (1) créer la trame, (2) former nos managers, (3) piloter la première campagne."
            className={`${inputClass} resize-y min-h-[140px]`}
          />
        </FieldGroup>
      </Section>

      {/* SECTION 3 — Contexte */}
      <Section index={3} title="Contexte entreprise" delay={160}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldGroup>
            <Label>Taille d&apos;entreprise</Label>
            <div className="flex flex-wrap gap-1.5">
              {COMPANY_SIZES.map((o) => {
                const active = companySize === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setCompanySize(o.key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      active
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-white ring-1 ring-neutral-300 text-neutral-700 hover:bg-primary-50 hover:ring-primary-300"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </FieldGroup>
          <FieldGroup>
            <Label required>Urgence</Label>
            <div className="flex flex-wrap gap-1.5">
              {URGENCY.map((o) => {
                const active = urgency === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setUrgency(o.key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      active
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-white ring-1 ring-neutral-300 text-neutral-700 hover:bg-primary-50 hover:ring-primary-300"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </FieldGroup>
        </div>
      </Section>

      {/* SECTION 4 — Modalités */}
      <Section index={4} title="Modalités" delay={240}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup>
            <Label htmlFor="startDate">Date de démarrage souhaitée</Label>
            <DatePicker
              id="startDate"
              value={startDate}
              onChange={setStartDate}
              placeholder="Choisir une date"
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="durationWeeks">Durée estimée (semaines)</Label>
            <input
              id="durationWeeks"
              type="number"
              min={1}
              max={104}
              value={durationWeeks}
              onChange={(e) =>
                setDurationWeeks(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Ex. 8"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="location">Lieu (si présentiel)</Label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex. Paris"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup className="md:col-span-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-primary-900 font-medium">
                Mission réalisable totalement ou partiellement à distance
              </span>
            </label>
          </FieldGroup>
        </div>
      </Section>

      {/* SECTION 5 — Budget */}
      <Section index={5} title="Budget" delay={320}>
        <FieldGroup>
          <Label htmlFor="budget">
            Budget envisagé{" "}
            <span className="text-neutral-500 font-normal">(optionnel)</span>
          </Label>
          <input
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Ex. 5 000 € HT, ou à définir selon proposition"
            className={inputClass}
          />
        </FieldGroup>
      </Section>

      {/* SECTION 6 — Contact */}
      <Section index={6} title="Contact" delay={400}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup>
            <Label htmlFor="contactName" required>Nom</Label>
            <input
              id="contactName"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="contactEmail" required>Email</Label>
            <input
              id="contactEmail"
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="contactPhone" required>Téléphone</Label>
            <input
              id="contactPhone"
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </Section>

      {/* SECTION 7 — Pièce jointe */}
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
            <span className="text-sm font-semibold text-primary-700">
              Joindre un brief, cahier des charges ou document utile
            </span>
            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" className="sr-only" onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)} />
          </label>
        )}
      </Section>

      {submitError && (
        <div className="rounded-[var(--radius-card)] bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          <strong>Impossible d&apos;envoyer la demande.</strong><br />{submitError}
        </div>
      )}

      <div className="sticky bottom-4 flex flex-col-reverse sm:flex-row gap-3 justify-end bg-white/90 backdrop-blur rounded-[var(--radius-card)] ring-1 ring-neutral-200 shadow-lg p-3">
        <button type="button" onClick={() => router.push("/client/nouvelle-demande")} className="rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50 transition">
          Retour
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
