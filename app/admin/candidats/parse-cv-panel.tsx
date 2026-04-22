"use client";

import { useState, useTransition } from "react";
import { discardParsedCvAction, parseCvAction, saveCandidateAction } from "./actions";
import type { ParsedCandidate } from "@/lib/cv-parser";

type ParsedState = {
  parsed: ParsedCandidate;
  cvPath: string;
  fileName: string;
};

type Props = {
  onSaved: () => void;
  onClose: () => void;
};

export function ParseCvPanel({ onSaved, onClose }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedState, setParsedState] = useState<ParsedState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<File[]>([]);

  async function parseOne(file: File) {
    setParsing(true);
    setError(null);
    const fd = new FormData();
    fd.set("cv", file);
    const res = await parseCvAction(fd);
    setParsing(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setParsedState({ parsed: res.parsed, cvPath: res.cvPath, fileName: res.fileName });
  }

  function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type === "application/pdf");
    if (list.length === 0) {
      setError("Sélectionnez au moins un fichier PDF.");
      return;
    }
    const [first, ...rest] = list;
    setQueue(rest);
    parseOne(first);
  }

  async function afterSave() {
    setParsedState(null);
    onSaved();
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      await parseOne(next);
    }
  }

  async function cancelCurrentParsing() {
    if (parsedState) {
      await discardParsedCvAction(parsedState.cvPath);
    }
    setParsedState(null);
    setQueue([]);
  }

  return (
    <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-5 sm:p-6 animate-fade-up">
      {!parsedState && !parsing && (
        <div
          className={`rounded-[var(--radius-card)] border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? "border-primary-500 bg-primary-50"
              : "border-primary-200 bg-primary-50/30 hover:border-primary-400 hover:bg-primary-50/50"
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
            handleFiles(e.dataTransfer.files);
          }}
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-primary-200">
            <svg
              className="h-7 w-7 text-primary-600"
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
              <path
                d="M12 18v-6m-3 3 3-3 3 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-sm font-bold text-primary-900">
            Glissez-déposez un ou plusieurs CV au format PDF
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            L&apos;IA extrait automatiquement les infos (métier, habilitations,
            expérience, langues…). Vous relisez et enregistrez.
          </p>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-button)] bg-primary-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-primary-700 transition">
            Choisir des fichiers
            <input
              type="file"
              accept=".pdf"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
            />
          </label>
          {error && (
            <p className="mt-3 text-xs text-rose-600 font-semibold">{error}</p>
          )}
        </div>
      )}

      {parsing && (
        <div className="rounded-[var(--radius-card)] bg-primary-50 ring-1 ring-primary-200 p-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow ring-1 ring-primary-200">
            <svg
              className="h-7 w-7 text-primary-600 animate-spin"
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
          </div>
          <p className="text-sm font-bold text-primary-900">
            Analyse du CV par l&apos;IA…
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            Extraction des informations en cours (~15-30 sec)
          </p>
        </div>
      )}

      {parsedState && !parsing && (
        <ParsedFormReview
          parsed={parsedState.parsed}
          cvPath={parsedState.cvPath}
          fileName={parsedState.fileName}
          queueLength={queue.length}
          onSaved={afterSave}
          onCancel={cancelCurrentParsing}
          onCloseAll={() => {
            cancelCurrentParsing();
            onClose();
          }}
        />
      )}
    </section>
  );
}

function ParsedFormReview({
  parsed,
  cvPath,
  fileName,
  queueLength,
  onSaved,
  onCancel,
  onCloseAll,
}: {
  parsed: ParsedCandidate;
  cvPath: string;
  fileName: string;
  queueLength: number;
  onSaved: () => void;
  onCancel: () => void;
  onCloseAll: () => void;
}) {
  const [firstName, setFirstName] = useState(parsed.firstName);
  const [lastName, setLastName] = useState(parsed.lastName);
  const [email, setEmail] = useState(parsed.email ?? "");
  const [phone, setPhone] = useState(parsed.phone ?? "");
  const [location, setLocation] = useState(parsed.location ?? "");
  const [headline, setHeadline] = useState(parsed.headline ?? "");
  const [primaryRome, setPrimaryRome] = useState(parsed.primaryRomeCode ?? "");
  const [primaryRomeLabel, setPrimaryRomeLabel] = useState(parsed.primaryRomeLabel ?? "");
  const [experienceYears, setExperienceYears] = useState<number | "">(
    parsed.experienceYears ?? "",
  );
  const [habilitations, setHabilitations] = useState<string[]>(parsed.habilitations);
  const [habilitationInput, setHabilitationInput] = useState("");
  const [permis, setPermis] = useState<string[]>(parsed.permis);
  const [skills, setSkills] = useState<string[]>(parsed.skills);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function addChip(list: string[], setList: (v: string[]) => void, value: string) {
    const v = value.trim();
    if (!v || list.includes(v)) return;
    setList([...list, v]);
  }
  function removeChip(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.filter((v) => v !== value));
  }

  function save() {
    setError(null);
    startSaving(async () => {
      const res = await saveCandidateAction({
        cvPath,
        cvFileName: fileName,
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        location: location || null,
        headline: headline || null,
        primaryRomeCode: primaryRome || null,
        primaryRomeLabel: primaryRomeLabel || null,
        experienceYears: experienceYears === "" ? null : Number(experienceYears),
        experiences: parsed.experiences,
        education: parsed.education,
        languages: parsed.languages,
        habilitations,
        permis,
        skills,
        tags,
        internalNotes: notes || null,
        availableFrom: availableFrom || null,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onSaved();
    });
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-lg font-extrabold text-primary-900">
            ✨ Infos extraites — vérifiez et enregistrez
          </h3>
          <p className="text-xs text-neutral-600">
            Fichier : <span className="font-mono">{fileName}</span>
            {queueLength > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold text-accent-700 ring-1 ring-accent-200">
                {queueLength} CV restant{queueLength > 1 ? "s" : ""} dans la file
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onCloseAll}
          className="text-xs font-semibold text-neutral-500 hover:text-rose-600"
        >
          Tout annuler
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Prénom" required>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Nom" required>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Téléphone">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Ville">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Dispo à partir du">
          <input
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Code ROME principal">
          <input
            value={primaryRome}
            onChange={(e) => setPrimaryRome(e.target.value.toUpperCase())}
            placeholder="Ex. F1603"
            className={`${inputClass} font-mono`}
          />
        </Field>
        <Field label="Intitulé métier" className="sm:col-span-2">
          <input
            value={primaryRomeLabel}
            onChange={(e) => setPrimaryRomeLabel(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Descriptif court" className="sm:col-span-2">
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Ex. Plombier chauffagiste — 8 ans"
            className={inputClass}
          />
        </Field>
        <Field label="Années d'expérience">
          <input
            type="number"
            min={0}
            max={60}
            value={experienceYears}
            onChange={(e) =>
              setExperienceYears(e.target.value === "" ? "" : Number(e.target.value))
            }
            className={inputClass}
          />
        </Field>
      </div>

      <ChipField
        label="Habilitations / formations"
        values={habilitations}
        input={habilitationInput}
        setInput={setHabilitationInput}
        onAdd={(v) => addChip(habilitations, setHabilitations, v)}
        onRemove={(v) => removeChip(habilitations, setHabilitations, v)}
        color="primary"
      />

      <ChipField
        label="Permis"
        values={permis}
        input=""
        setInput={() => {}}
        onAdd={(v) => addChip(permis, setPermis, v)}
        onRemove={(v) => removeChip(permis, setPermis, v)}
        color="accent"
        presets={["B", "BE", "C", "C1", "CE", "D"]}
      />

      <ChipField
        label="Compétences"
        values={skills}
        input=""
        setInput={() => {}}
        onAdd={(v) => addChip(skills, setSkills, v)}
        onRemove={(v) => removeChip(skills, setSkills, v)}
      />

      <ChipField
        label="Tags internes (pour toi)"
        values={tags}
        input={tagInput}
        setInput={setTagInput}
        onAdd={(v) => addChip(tags, setTags, v)}
        onRemove={(v) => removeChip(tags, setTags, v)}
        presets={["Profil fiable", "Dispo immédiate", "À rappeler", "Mission courte"]}
      />

      <Field label="Notes internes (privées)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={`${inputClass} resize-y min-h-[80px]`}
          placeholder="Points forts, retour d'expérience, restrictions…"
        />
      </Field>

      {error && (
        <div className="rounded-[var(--radius-button)] bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-end sticky bottom-4 bg-white/95 backdrop-blur p-3 rounded-xl ring-1 ring-neutral-200 shadow-md">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50 transition"
        >
          Ignorer ce candidat
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving || !firstName.trim() || !lastName.trim()}
          className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-accent-600 disabled:opacity-50 transition"
        >
          {saving ? "Enregistrement…" : queueLength > 0 ? "Enregistrer & passer au suivant" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

function ChipField({
  label,
  values,
  input,
  setInput,
  onAdd,
  onRemove,
  color = "neutral",
  presets,
}: {
  label: string;
  values: string[];
  input: string;
  setInput: (v: string) => void;
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  color?: "primary" | "accent" | "neutral";
  presets?: string[];
}) {
  const chipColorClass = {
    primary: "bg-primary-50 ring-primary-200 text-primary-800",
    accent: "bg-accent-50 ring-accent-200 text-accent-800",
    neutral: "bg-neutral-50 ring-neutral-200 text-neutral-800",
  }[color];

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-primary-900">{label}</label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className={`inline-flex items-center gap-1 rounded-full ring-1 pl-2.5 pr-1 py-1 text-xs font-semibold shadow-sm ${chipColorClass}`}
            >
              {v}
              <button
                type="button"
                onClick={() => onRemove(v)}
                className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/70"
                aria-label={`Retirer ${v}`}
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
      {presets && (
        <div className="flex flex-wrap gap-1">
          {presets
            .filter((p) => !values.includes(p))
            .map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onAdd(p)}
                className="rounded-full border border-dashed border-neutral-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-600 hover:border-primary-400 hover:text-primary-700 transition"
              >
                + {p}
              </button>
            ))}
        </div>
      )}
      {setInput !== (() => {}) && (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (input.trim()) {
                  onAdd(input);
                  setInput("");
                }
              }
            }}
            placeholder="Ajouter (Entrée pour valider)"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => {
              if (input.trim()) {
                onAdd(input);
                setInput("");
              }
            }}
            className="rounded-[var(--radius-button)] bg-primary-600 px-3 text-xs font-bold text-white hover:bg-primary-700 transition"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white px-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15";

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <label className="text-xs font-semibold text-primary-900 flex items-center gap-1">
        {label}
        {required && <span className="text-accent-500">*</span>}
      </label>
      {children}
    </div>
  );
}
