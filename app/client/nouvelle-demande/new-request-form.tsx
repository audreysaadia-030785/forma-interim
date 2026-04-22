"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { RomeCombobox } from "@/app/components/rome-combobox";
import { suggestHabilitations } from "@/lib/habilitations";
import { submitRequestAction } from "./actions";

type DurationUnit = "jours" | "semaines" | "mois";

export function NewRequestForm() {
  const router = useRouter();

  // Champs
  const [jobLabel, setJobLabel] = useState("");
  const [jobCode, setJobCode] = useState<string | null>(null);
  const [headcount, setHeadcount] = useState(1);
  const [habilitations, setHabilitations] = useState<string[]>([]);
  /** Habilitations personnalisées (non issues des suggestions). */
  const [customHabilitations, setCustomHabilitations] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");

  const [startDate, setStartDate] = useState("");
  const [durationValue, setDurationValue] = useState<number | "">("");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("mois");
  const [location, setLocation] = useState("");

  const [hourlyRate, setHourlyRate] = useState("");
  const [meals, setMeals] = useState("");
  const [travelBonus, setTravelBonus] = useState("");
  const [transportAllowance, setTransportAllowance] = useState("");
  const [otherPremium, setOtherPremium] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [description, setDescription] = useState("");

  // Fiche de poste jointe (PDF / DOC / DOCX / image)
  const [jobSpecFile, setJobSpecFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, startSubmitting] = useTransition();

  const suggested = useMemo(
    () => suggestHabilitations(jobLabel),
    [jobLabel],
  );

  // Suggestions libres (chips) selon quelques mots-clés — léger pour éviter
  // de recharger un dico complet. Le client peut toujours écrire ce qu'il veut.
  const jobChips = useMemo<string[]>(() => {
    const l = jobLabel.toLowerCase();
    if (/plomb|chauffag|sanita/.test(l))
      return [
        "Expérience chantier neuf",
        "Lecture de plans",
        "EPI fournis",
        "Mission longue durée",
      ];
    if (/électric|electri/.test(l))
      return [
        "Tirage de câbles",
        "Raccordement tableau",
        "Lecture de schémas",
        "EPI fournis",
      ];
    if (/maço|coffr/.test(l))
      return ["Coffrage traditionnel", "Lecture de plans", "Expérience GO"];
    if (/cariste|magasin|logisti/.test(l))
      return [
        "Horaires en 2×8",
        "Préparation de commandes",
        "Gestion des stocks",
      ];
    if (/cuisin|restaurat|serveu/.test(l))
      return ["HACCP", "Service en salle", "Coupures", "Horaires soirée"];
    return [
      "Expérience exigée",
      "Travail en équipe",
      "Mission longue durée",
      "EPI fournis",
    ];
  }, [jobLabel]);

  function toggleHabilitation(h: string) {
    setHabilitations((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h],
    );
  }

  function addCustomHabilitation() {
    const value = customInput.trim();
    if (!value) return;
    // Évite les doublons avec les habilitations standard ou custom.
    if (customHabilitations.includes(value) || habilitations.includes(value))
      return;
    setCustomHabilitations((prev) => [...prev, value]);
    setCustomInput("");
  }

  function removeCustomHabilitation(h: string) {
    setCustomHabilitations((prev) => prev.filter((x) => x !== h));
  }

  function toggleChip(chip: string) {
    setDescription((prev) => {
      const trimmed = prev.trim();
      if (trimmed.includes(chip)) {
        return trimmed
          .replace(new RegExp(`^•\\s*${chip}$`, "m"), "")
          .replace(/\n{2,}/g, "\n")
          .trim();
      }
      return trimmed ? `${trimmed}\n• ${chip}` : `• ${chip}`;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const fd = new FormData();
    fd.set("jobLabel", jobLabel);
    if (jobCode) fd.set("jobCode", jobCode);
    fd.set("headcount", String(headcount));
    fd.set("habilitations", JSON.stringify(habilitations));
    fd.set("customHabilitations", JSON.stringify(customHabilitations));
    fd.set("description", description);
    fd.set("startDate", startDate);
    fd.set("durationValue", String(durationValue || 0));
    fd.set("durationUnit", durationUnit);
    fd.set("location", location);
    fd.set("hourlyRate", hourlyRate);
    if (meals) fd.set("meals", meals);
    if (travelBonus) fd.set("travelBonus", travelBonus);
    if (transportAllowance) fd.set("transportAllowance", transportAllowance);
    if (otherPremium) fd.set("otherPremium", otherPremium);
    fd.set("contactName", contactName);
    fd.set("contactEmail", contactEmail);
    fd.set("contactPhone", contactPhone);
    if (jobSpecFile) fd.set("jobSpec", jobSpecFile);

    startSubmitting(async () => {
      const res = await submitRequestAction(fd);
      if (res && !res.ok) {
        setSubmitError(res.error ?? "Erreur inconnue");
      }
      // Sinon, la Server Action redirige automatiquement vers /client.
    });
  }

  function handleFilePick(file: File | null) {
    if (!file) {
      setJobSpecFile(null);
      return;
    }
    const maxMb = 10;
    if (file.size > maxMb * 1024 * 1024) {
      alert(`Fichier trop volumineux (max ${maxMb} Mo).`);
      return;
    }
    setJobSpecFile(file);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* BLOC — Import fiche de poste existante */}
      <section
        className={`relative rounded-[var(--radius-card)] border-2 border-dashed p-5 sm:p-6 transition-all animate-fade-up ${
          dragActive
            ? "border-primary-500 bg-primary-50"
            : jobSpecFile
              ? "border-emerald-400 bg-emerald-50/50"
              : "border-primary-200 bg-primary-50/40 hover:border-primary-400 hover:bg-primary-50"
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFilePick(e.dataTransfer.files?.[0] ?? null);
        }}
      >
        {jobSpecFile ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-200 shadow-sm">
              <svg
                className="h-6 w-6 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="M4 12.5 9.5 18 20 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary-900 truncate">
                {jobSpecFile.name}
              </p>
              <p className="text-xs text-neutral-600">
                {(jobSpecFile.size / 1024).toFixed(0)} Ko · Fiche de poste jointe
                à votre demande
              </p>
            </div>
            <button
              type="button"
              onClick={() => setJobSpecFile(null)}
              className="rounded-full p-2 text-neutral-500 hover:bg-white hover:text-rose-600 transition"
              aria-label="Retirer le fichier"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  d="M5 5l10 10M15 5 5 15"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-primary-200 shadow-sm">
              <svg
                className="h-6 w-6 text-primary-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zm0 0v5h5"
                  strokeLinejoin="round"
                />
                <path d="M12 18v-6m-3 3 3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary-900">
                Vous avez déjà une fiche de poste&nbsp;?{" "}
                <span className="text-accent-500">Ajoutez-la ici</span>
              </p>
              <p className="text-xs text-neutral-600 mt-0.5">
                PDF, DOC, DOCX ou image — 10 Mo max. Cela nous aide à trouver
                plus vite les bons profils.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-bold text-primary-700 ring-1 ring-primary-300 shadow-sm hover:bg-primary-50 transition">
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path
                  d="M10 4.5v11m-5.5-5.5h11"
                  strokeLinecap="round"
                />
              </svg>
              Choisir un fichier
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                className="sr-only"
                onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        )}
      </section>

      {/* SECTION 1 — Le poste */}
      <Section index={1} title="Le poste" subtitle="Que recherchez-vous ?" delay={0}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup className="md:col-span-2">
            <Label htmlFor="poste" required>
              Intitulé du poste
            </Label>
            <RomeCombobox
              id="poste"
              required
              value={jobLabel}
              onChange={({ label, code }) => {
                setJobLabel(label);
                setJobCode(code);
                setHabilitations([]);
              }}
            />
            {jobCode && (
              <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-1">
                <span className="inline-flex h-4 items-center justify-center rounded bg-primary-100 px-1 text-[10px] font-bold text-primary-700 font-mono">
                  {jobCode}
                </span>
                Code ROME — nomenclature France&nbsp;Travail
              </p>
            )}
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="headcount" required>
              Nombre de personnes
            </Label>
            <input
              id="headcount"
              type="number"
              min={1}
              max={99}
              required
              value={headcount}
              onChange={(e) => setHeadcount(Number(e.target.value))}
              className={inputClass}
            />
          </FieldGroup>
        </div>

        {/* Habilitations / Formations */}
        <FieldGroup>
          <Label>
            Habilitations / formations requises{" "}
            <span className="text-neutral-500 font-normal">
              (cochez ce qui s'applique)
            </span>
          </Label>

          {suggested.habilitations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-[var(--radius-button)] bg-neutral-50/70 ring-1 ring-neutral-200 p-3">
                {suggested.habilitations.map((h) => {
                  const checked = habilitations.includes(h);
                  return (
                    <label
                      key={h}
                      className={`flex items-start gap-2.5 rounded-lg px-3 py-1.5 text-sm cursor-pointer select-none transition-all ${
                        checked
                          ? "bg-primary-50 ring-1 ring-primary-300 text-primary-900 font-semibold"
                          : "hover:bg-white text-neutral-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleHabilitation(h)}
                        className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span>{h}</span>
                    </label>
                  );
                })}
              </div>
              {!suggested.specific && jobLabel && (
                <p className="mt-1 text-[11px] text-neutral-500">
                  Aucune règle spécifique pour ce métier — socle générique
                  proposé. Ajoutez vos exigences ci-dessous.
                </p>
              )}
            </>
          ) : (
            <p className="text-xs italic text-neutral-500 rounded-[var(--radius-button)] bg-neutral-50 ring-1 ring-neutral-200 px-3 py-2.5">
              Vous pouvez saisir vos habilitations manuellement ci-dessous,
              même sans sélectionner de métier.
            </p>
          )}

          {/* Autre — champ multi-chips */}
          <div className="mt-3 rounded-[var(--radius-button)] border border-dashed border-primary-300 bg-primary-50/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  aria-hidden="true"
                >
                  <path d="M10 4v12m-6-6h12" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-xs font-bold text-primary-900">
                Autre (à préciser) — spécifique à votre entreprise
              </span>
            </div>

            {customHabilitations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {customHabilitations.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-primary-300 pl-3 pr-1 py-1 text-xs font-semibold text-primary-800 shadow-sm"
                  >
                    {h}
                    <button
                      type="button"
                      onClick={() => removeCustomHabilitation(h)}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-neutral-500 hover:bg-rose-50 hover:text-rose-600 transition"
                      aria-label={`Retirer ${h}`}
                    >
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 5l10 10M15 5 5 15"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomHabilitation();
                  }
                }}
                placeholder="Ex. Habilitation interne, diplôme spécifique… (Entrée pour ajouter)"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addCustomHabilitation}
                disabled={!customInput.trim()}
                className="rounded-[var(--radius-button)] bg-primary-600 px-4 text-xs font-bold text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Ajouter
              </button>
            </div>
          </div>
        </FieldGroup>

        {/* Caractéristiques du poste */}
        <FieldGroup>
          <Label htmlFor="description">
            Caractéristiques du poste{" "}
            <span className="text-neutral-500 font-normal">(facultatif)</span>
          </Label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez la mission, les horaires, les prérequis spécifiques…"
            className={`${inputClass} resize-y min-h-[100px]`}
          />
          {jobLabel && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-neutral-600 mb-1.5">
                Suggestions adaptées au poste
              </p>
              <div className="flex flex-wrap gap-1.5">
                {jobChips.map((chip) => {
                  const active = description.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleChip(chip)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition-all ${
                        active
                          ? "bg-primary-600 text-white ring-primary-600"
                          : "bg-white text-neutral-700 ring-neutral-300 hover:bg-primary-50 hover:ring-primary-300"
                      }`}
                    >
                      {active ? "✓ " : "+ "}
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </FieldGroup>
      </Section>

      {/* SECTION 2 — Planning & lieu */}
      <Section index={2} title="Planning & lieu" subtitle="Quand et où ?" delay={80}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup>
            <Label htmlFor="startDate" required>
              Date de démarrage
            </Label>
            <input
              id="startDate"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </FieldGroup>

          <FieldGroup>
            <Label required>Durée</Label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                required
                value={durationValue}
                onChange={(e) =>
                  setDurationValue(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="3"
                className={`${inputClass} w-24`}
              />
              <div className="relative flex-1">
                <select
                  value={durationUnit}
                  onChange={(e) =>
                    setDurationUnit(e.target.value as DurationUnit)
                  }
                  className={`${selectClass} pr-9`}
                >
                  <option value="jours">jours</option>
                  <option value="semaines">semaines</option>
                  <option value="mois">mois</option>
                </select>
                <ChevronIcon />
              </div>
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="location" required>
              Lieu de mission
            </Label>
            <input
              id="location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex. Toulon (83)"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </Section>

      {/* SECTION 3 — Rémunération */}
      <Section
        index={3}
        title="Rémunération"
        subtitle="Conditions financières proposées"
        delay={160}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldGroup>
            <Label htmlFor="hourlyRate" required>
              Taux horaire
            </Label>
            <InputWithSuffix
              id="hourlyRate"
              suffix="€ brut / h"
              required
              value={hourlyRate}
              onChange={setHourlyRate}
              type="number"
              step="0.01"
              min="0"
              placeholder="15.50"
            />
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Précisez bien le montant brut par heure travaillée.
            </p>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="meals">
              Prime repas (panier){" "}
              <span className="text-neutral-500 font-normal">
                (selon conventions collectives)
              </span>
            </Label>
            <InputWithSuffix
              id="meals"
              suffix="€ / jour"
              value={meals}
              onChange={setMeals}
              type="number"
              step="0.01"
              min="0"
              placeholder="10.50"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="travelBonus">
              Prime trajet{" "}
              <span className="text-neutral-500 font-normal">
                (selon conventions collectives)
              </span>
            </Label>
            <InputWithSuffix
              id="travelBonus"
              suffix="€ / jour"
              value={travelBonus}
              onChange={setTravelBonus}
              type="number"
              step="0.01"
              min="0"
              placeholder="5.00"
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="transportAllowance">
              Indemnité transport{" "}
              <span className="text-neutral-500 font-normal">
                (selon conventions collectives)
              </span>
            </Label>
            <InputWithSuffix
              id="transportAllowance"
              suffix="€ / jour"
              value={transportAllowance}
              onChange={setTransportAllowance}
              type="number"
              step="0.01"
              min="0"
              placeholder="3.50"
            />
          </FieldGroup>

          <FieldGroup className="md:col-span-2">
            <Label htmlFor="otherPremium">
              Autre prime ou indemnité{" "}
              <span className="text-neutral-500 font-normal">
                (selon conventions collectives)
              </span>
            </Label>
            <input
              id="otherPremium"
              value={otherPremium}
              onChange={(e) => setOtherPremium(e.target.value)}
              placeholder="Ex. Prime de chantier 150€, véhicule de service…"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </Section>

      {/* SECTION 4 — Contact */}
      <Section index={4} title="Contact" subtitle="Qui suit cette mission chez vous ?" delay={240}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup>
            <Label htmlFor="contactName" required>
              Nom du contact
            </Label>
            <input
              id="contactName"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={inputClass}
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="contactEmail" required>
              Email
            </Label>
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
            <Label htmlFor="contactPhone" required>
              Téléphone
            </Label>
            <input
              id="contactPhone"
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="06 12 34 56 78"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </Section>

      {submitError && (
        <div className="rounded-[var(--radius-card)] bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 flex items-start gap-2 animate-fade-up">
          <svg
            className="h-4 w-4 mt-0.5 shrink-0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="7" />
            <path d="M10 6v4m0 3v.01" strokeLinecap="round" />
          </svg>
          <span>
            <strong>Impossible d&apos;envoyer la demande.</strong>
            <br />
            {submitError}
          </span>
        </div>
      )}

      {/* Barre d'actions */}
      <div className="sticky bottom-4 flex flex-col-reverse sm:flex-row gap-3 justify-end bg-white/90 backdrop-blur rounded-[var(--radius-card)] ring-1 ring-neutral-200 shadow-lg p-3">
        <button
          type="button"
          onClick={() => router.push("/client")}
          className="rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 hover:shadow-accent-500/40 disabled:opacity-70 transition-all"
        >
          {submitting ? (
            <>
              <Spinner />
              Envoi…
            </>
          ) : (
            <>
              Envoyer la demande
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4.5 10h11m0 0L10 4.5M15.5 10 10 15.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ------ Styles & Sous-composants ------ */

const inputClass =
  "w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white px-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15";

const selectClass = `${inputClass} appearance-none cursor-pointer`;

function ChevronIcon() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 7.5 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Section({
  index,
  title,
  subtitle,
  delay = 0,
  children,
}: {
  index: number;
  title: string;
  subtitle?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 sm:p-6 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <header className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white font-bold shadow-md shadow-primary-600/20">
          {index}
        </span>
        <div>
          <h2 className="text-base font-bold text-primary-900">{title}</h2>
          {subtitle && (
            <p className="text-xs text-neutral-600">{subtitle}</p>
          )}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FieldGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`space-y-1 ${className ?? ""}`}>{children}</div>;
}

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold text-primary-900 flex items-center gap-1"
    >
      {children}
      {required && <span className="text-accent-500">*</span>}
    </label>
  );
}

function InputWithSuffix({
  id,
  suffix,
  value,
  onChange,
  ...props
}: {
  id: string;
  suffix: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "id"
>) {
  return (
    <div className="relative">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
        className={`${inputClass} pr-24`}
      />
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] font-semibold text-neutral-500">
        {suffix}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="4"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
