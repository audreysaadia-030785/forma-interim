"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { RomeCombobox } from "@/app/components/rome-combobox";
import { DatePicker } from "@/app/components/date-picker";
import { suggestHabilitations } from "@/lib/habilitations";
import { generateJobDescriptionAction, submitRecruitmentRequestAction } from "./actions";

type ContractType = "cdi" | "cdd" | "alternance" | "stage" | "freelance";
type ExperienceLevel = "junior" | "confirme" | "senior" | "expert";
type RemoteWork = "none" | "hybrid" | "full";

const CONTRACT_OPTIONS: Array<{ value: ContractType; label: string }> = [
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "alternance", label: "Alternance" },
  { value: "stage", label: "Stage" },
  { value: "freelance", label: "Freelance" },
];

const EXPERIENCE_OPTIONS: Array<{ value: ExperienceLevel; label: string }> = [
  { value: "junior", label: "Junior (0-2 ans)" },
  { value: "confirme", label: "Confirmé (3-7 ans)" },
  { value: "senior", label: "Senior (8-15 ans)" },
  { value: "expert", label: "Expert (15+ ans)" },
];

const REMOTE_OPTIONS: Array<{ value: RemoteWork; label: string }> = [
  { value: "none", label: "100% présentiel" },
  { value: "hybrid", label: "Hybride" },
  { value: "full", label: "100% télétravail" },
];

export function RecruitmentForm() {
  const router = useRouter();

  const [jobLabel, setJobLabel] = useState("");
  const [jobCode, setJobCode] = useState<string | null>(null);
  const [headcount, setHeadcount] = useState(1);
  const [contractType, setContractType] = useState<ContractType>("cdi");
  const [cddDurationMonths, setCddDurationMonths] = useState<number | "">("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("confirme");
  const [educationLevel, setEducationLevel] = useState("");
  const [habilitations, setHabilitations] = useState<string[]>([]);
  const [customHabilitations, setCustomHabilitations] = useState<string[]>([]);
  const [customHabilitationInput, setCustomHabilitationInput] = useState("");

  const [startDate, setStartDate] = useState("");
  const [trialPeriodMonths, setTrialPeriodMonths] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [remoteWork, setRemoteWork] = useState<RemoteWork>("none");

  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [variablePay, setVariablePay] = useState("");
  const [benefits, setBenefits] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [description, setDescription] = useState("");

  const [jobSpecFile, setJobSpecFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, startSubmitting] = useTransition();
  const [generatingDescription, startGenerating] = useTransition();

  const suggested = useMemo(() => suggestHabilitations(jobLabel), [jobLabel]);

  const jobChips = useMemo<string[]>(() => {
    const l = jobLabel.toLowerCase();
    if (/comptable|gestionnaire/.test(l))
      return ["Maîtrise Excel", "Logiciels comptables (Sage, EBP…)", "Discrétion", "Sens des chiffres"];
    if (/commercial|sales/.test(l))
      return ["Goût du challenge", "Aisance relationnelle", "Anglais professionnel", "Permis B"];
    if (/dev|développeur|developpeur|programmeur/.test(l))
      return ["Méthodes agiles", "Git / GitHub", "Tests unitaires", "Anglais technique"];
    if (/cuisin|chef de cuisine/.test(l))
      return ["HACCP", "Travail en équipe", "Coupures", "Créativité"];
    return ["Autonomie", "Travail en équipe", "Sens du service", "Bonne présentation"];
  }, [jobLabel]);

  function toggleHabilitation(h: string) {
    setHabilitations((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h],
    );
  }
  function addCustomHabilitation() {
    const v = customHabilitationInput.trim();
    if (!v) return;
    if (customHabilitations.includes(v) || habilitations.includes(v)) return;
    setCustomHabilitations((prev) => [...prev, v]);
    setCustomHabilitationInput("");
  }
  function removeCustomHabilitation(h: string) {
    setCustomHabilitations((prev) => prev.filter((x) => x !== h));
  }
  function handleGenerateDescription() {
    if (!jobLabel.trim()) {
      alert("Sélectionnez d'abord un intitulé de poste.");
      return;
    }
    if (
      description.trim() &&
      !confirm(
        "La description actuelle sera remplacée par celle générée par l'IA. Continuer ?",
      )
    ) {
      return;
    }
    startGenerating(async () => {
      const res = await generateJobDescriptionAction({
        jobLabel,
        jobCode,
        contractType,
        experienceLevel,
      });
      if (!res.ok) {
        alert(`Erreur : ${res.error}`);
        return;
      }
      setDescription(res.text);
    });
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

  function handleFilePick(file: File | null) {
    if (!file) {
      setJobSpecFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Fichier trop volumineux (max 10 Mo).");
      return;
    }
    setJobSpecFile(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const fd = new FormData();
    fd.set("jobLabel", jobLabel);
    if (jobCode) fd.set("jobCode", jobCode);
    fd.set("headcount", String(headcount));
    fd.set("contractType", contractType);
    if (contractType === "cdd" && cddDurationMonths)
      fd.set("cddDurationMonths", String(cddDurationMonths));
    fd.set("experienceLevel", experienceLevel);
    if (educationLevel) fd.set("educationLevel", educationLevel);
    fd.set("habilitations", JSON.stringify(habilitations));
    fd.set("customHabilitations", JSON.stringify(customHabilitations));
    fd.set("description", description);
    fd.set("startDate", startDate);
    if (trialPeriodMonths)
      fd.set("trialPeriodMonths", String(trialPeriodMonths));
    fd.set("location", location);
    fd.set("remoteWork", remoteWork);
    if (salaryMin) fd.set("salaryMin", salaryMin);
    if (salaryMax) fd.set("salaryMax", salaryMax);
    if (variablePay) fd.set("variablePay", variablePay);
    if (benefits) fd.set("benefits", benefits);
    fd.set("contactName", contactName);
    fd.set("contactEmail", contactEmail);
    fd.set("contactPhone", contactPhone);
    if (jobSpecFile) fd.set("jobSpec", jobSpecFile);

    startSubmitting(async () => {
      const res = await submitRecruitmentRequestAction(fd);
      if (res && !res.ok) setSubmitError(res.error ?? "Erreur inconnue");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* IMPORT FICHE DE POSTE */}
      <section
        className={`relative rounded-[var(--radius-card)] border-2 border-dashed p-5 sm:p-6 transition-all animate-fade-up ${
          dragActive
            ? "border-primary-500 bg-primary-50"
            : jobSpecFile
              ? "border-emerald-400 bg-emerald-50/50"
              : "border-primary-200 bg-primary-50/40 hover:border-primary-400 hover:bg-primary-50"
        }`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFilePick(e.dataTransfer.files?.[0] ?? null); }}
      >
        {jobSpecFile ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-emerald-200 shadow-sm">
              <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 12.5 9.5 18 20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-primary-900 truncate">{jobSpecFile.name}</p>
              <p className="text-xs text-neutral-600">{(jobSpecFile.size / 1024).toFixed(0)} Ko · Fiche de poste jointe</p>
            </div>
            <button type="button" onClick={() => setJobSpecFile(null)} className="rounded-full p-2 text-neutral-500 hover:bg-white hover:text-rose-600 transition" aria-label="Retirer">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" /></svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-primary-200 shadow-sm">
              <svg className="h-6 w-6 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zm0 0v5h5" strokeLinejoin="round" />
                <path d="M12 18v-6m-3 3 3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary-900">
                Vous avez déjà une fiche de poste&nbsp;? <span className="text-accent-500">Joignez-la</span>
              </p>
              <p className="text-xs text-neutral-600 mt-0.5">PDF, DOC, DOCX ou image — 10 Mo max. Cela nous aide à trouver plus vite les bons profils.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-bold text-primary-700 ring-1 ring-primary-300 shadow-sm hover:bg-primary-50 transition">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M10 4.5v11m-5.5-5.5h11" strokeLinecap="round" /></svg>
              Choisir un fichier
              <input type="file" accept=".pdf,.doc,.docx,image/*" className="sr-only" onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)} />
            </label>
          </div>
        )}
      </section>

      {/* SECTION 1 — Le poste */}
      <Section index={1} title="Le poste" subtitle="Quel profil recherchez-vous ?" delay={0}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup className="md:col-span-2">
            <Label htmlFor="poste" required>Intitulé du poste</Label>
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
                <span className="inline-flex h-4 items-center justify-center rounded bg-primary-100 px-1 text-[10px] font-bold text-primary-700 font-mono">{jobCode}</span>
                Code ROME — nomenclature France&nbsp;Travail
              </p>
            )}
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="headcount" required>Nombre de postes</Label>
            <input id="headcount" type="number" min={1} max={50} required value={headcount} onChange={(e) => setHeadcount(Number(e.target.value))} className={inputClass} />
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup>
            <Label required>Type de contrat</Label>
            <div className="relative">
              <select value={contractType} onChange={(e) => setContractType(e.target.value as ContractType)} className={`${selectClass} pr-10`}>
                {CONTRACT_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
              <ChevronIcon />
            </div>
          </FieldGroup>

          {contractType === "cdd" && (
            <FieldGroup>
              <Label required>Durée du CDD</Label>
              <div className="relative">
                <input type="number" min={1} max={36} required value={cddDurationMonths} onChange={(e) => setCddDurationMonths(e.target.value === "" ? "" : Number(e.target.value))} placeholder="6" className={`${inputClass} pr-16`} />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] font-semibold text-neutral-500">mois</span>
              </div>
            </FieldGroup>
          )}

          <FieldGroup>
            <Label required>Niveau d&apos;expérience</Label>
            <div className="relative">
              <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)} className={`${selectClass} pr-10`}>
                {EXPERIENCE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
              <ChevronIcon />
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="educationLevel">Niveau d&apos;études <span className="text-neutral-500 font-normal">(optionnel)</span></Label>
            <input id="educationLevel" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} placeholder="Ex. Bac+3, BTS, ingénieur…" className={inputClass} />
          </FieldGroup>
        </div>

        <FieldGroup>
          <Label>Habilitations / certifications / compétences clés <span className="text-neutral-500 font-normal">(cochez ce qui s&apos;applique)</span></Label>
          {suggested.habilitations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-[var(--radius-button)] bg-neutral-50/70 ring-1 ring-neutral-200 p-3">
                {suggested.habilitations.map((h) => {
                  const checked = habilitations.includes(h);
                  return (
                    <label key={h} className={`flex items-start gap-2.5 rounded-lg px-3 py-1.5 text-sm cursor-pointer select-none transition-all ${checked ? "bg-primary-50 ring-1 ring-primary-300 text-primary-900 font-semibold" : "hover:bg-white text-neutral-700"}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleHabilitation(h)} className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" />
                      <span>{h}</span>
                    </label>
                  );
                })}
              </div>
              {!suggested.specific && jobLabel && (<p className="mt-1 text-[11px] text-neutral-500">Aucune règle spécifique pour ce métier — socle générique proposé.</p>)}
            </>
          ) : (
            <p className="text-xs italic text-neutral-500 rounded-[var(--radius-button)] bg-neutral-50 ring-1 ring-neutral-200 px-3 py-2.5">Vous pouvez saisir vos exigences manuellement ci-dessous, même sans sélectionner de métier.</p>
          )}

          <div className="mt-3 rounded-[var(--radius-button)] border border-dashed border-primary-300 bg-primary-50/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white">
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="M10 4v12m-6-6h12" strokeLinecap="round" /></svg>
              </span>
              <span className="text-xs font-bold text-primary-900">Autre (à préciser)</span>
            </div>
            {customHabilitations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {customHabilitations.map((h) => (
                  <span key={h} className="inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-primary-300 pl-3 pr-1 py-1 text-xs font-semibold text-primary-800 shadow-sm">
                    {h}
                    <button type="button" onClick={() => removeCustomHabilitation(h)} className="flex h-5 w-5 items-center justify-center rounded-full text-neutral-500 hover:bg-rose-50 hover:text-rose-600 transition" aria-label={`Retirer ${h}`}>
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" /></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={customHabilitationInput} onChange={(e) => setCustomHabilitationInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomHabilitation(); } }} placeholder="Ex. Diplôme spécifique… (Entrée pour ajouter)" className={`${inputClass} flex-1`} />
              <button type="button" onClick={addCustomHabilitation} disabled={!customHabilitationInput.trim()} className="rounded-[var(--radius-button)] bg-primary-600 px-4 text-xs font-bold text-white hover:bg-primary-700 disabled:opacity-50 transition">Ajouter</button>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup>
          <div className="flex items-end justify-between gap-3 mb-1">
            <Label htmlFor="description">Description du poste <span className="text-neutral-500 font-normal">(missions, environnement, équipe…)</span></Label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generatingDescription || !jobLabel}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
            >
              {generatingDescription ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Génération…
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 2 L11 7 L16 8 L11 9 L10 14 L9 9 L4 8 L9 7 Z" />
                    <circle cx="16" cy="3" r="1" />
                    <circle cx="4" cy="14" r="1" />
                  </svg>
                  Générer avec l&apos;IA
                </>
              )}
            </button>
          </div>
          <textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez les missions, l'équipe, l'environnement, les attendus… ou cliquez sur « Générer avec l'IA »." className={`${inputClass} resize-y min-h-[140px]`} />
          {jobLabel && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-neutral-600 mb-1.5">Suggestions adaptées au poste</p>
              <div className="flex flex-wrap gap-1.5">
                {jobChips.map((chip) => {
                  const active = description.includes(chip);
                  return (
                    <button key={chip} type="button" onClick={() => toggleChip(chip)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition-all ${active ? "bg-primary-600 text-white ring-primary-600" : "bg-white text-neutral-700 ring-neutral-300 hover:bg-primary-50 hover:ring-primary-300"}`}>
                      {active ? "✓ " : "+ "}{chip}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </FieldGroup>
      </Section>

      {/* SECTION 2 */}
      <Section index={2} title="Démarrage & modalités" subtitle="Quand, où et comment ?" delay={80}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup>
            <Label htmlFor="startDate" required>Date de prise de poste souhaitée</Label>
            <DatePicker id="startDate" required value={startDate} onChange={setStartDate} placeholder="Choisir une date" />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="trialPeriod">Période d&apos;essai <span className="text-neutral-500 font-normal">(optionnel)</span></Label>
            <div className="relative">
              <input id="trialPeriod" type="number" min={0} max={12} value={trialPeriodMonths} onChange={(e) => setTrialPeriodMonths(e.target.value === "" ? "" : Number(e.target.value))} placeholder="2" className={`${inputClass} pr-16`} />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] font-semibold text-neutral-500">mois</span>
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="location" required>Lieu du poste</Label>
            <input id="location" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex. Paris (75) ou Toulon (83)" className={inputClass} />
          </FieldGroup>

          <FieldGroup className="md:col-span-3">
            <Label>Télétravail</Label>
            <div className="flex flex-wrap gap-2">
              {REMOTE_OPTIONS.map((o) => {
                const active = remoteWork === o.value;
                return (
                  <button key={o.value} type="button" onClick={() => setRemoteWork(o.value)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-primary-600 text-white shadow-sm" : "bg-white ring-1 ring-neutral-300 text-neutral-700 hover:bg-primary-50 hover:ring-primary-300"}`}>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </FieldGroup>
        </div>
      </Section>

      {/* SECTION 3 */}
      <Section index={3} title="Rémunération & avantages" subtitle="Ce que vous proposez" delay={160}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FieldGroup>
            <Label htmlFor="salaryMin" required>Salaire annuel brut — min</Label>
            <div className="relative">
              <input id="salaryMin" type="number" required min={0} step="100" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="35000" className={`${inputClass} pr-20`} />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] font-semibold text-neutral-500">€ / an</span>
            </div>
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="salaryMax">Salaire annuel brut — max <span className="text-neutral-500 font-normal">(optionnel)</span></Label>
            <div className="relative">
              <input id="salaryMax" type="number" min={0} step="100" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="45000" className={`${inputClass} pr-20`} />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] font-semibold text-neutral-500">€ / an</span>
            </div>
          </FieldGroup>

          <FieldGroup className="md:col-span-2">
            <Label htmlFor="variablePay">Variable / commissions <span className="text-neutral-500 font-normal">(optionnel)</span></Label>
            <input id="variablePay" value={variablePay} onChange={(e) => setVariablePay(e.target.value)} placeholder="Ex. Variable jusqu'à 15% du fixe sur objectifs" className={inputClass} />
          </FieldGroup>

          <FieldGroup className="md:col-span-2">
            <Label htmlFor="benefits">Avantages <span className="text-neutral-500 font-normal">(tickets restaurant, mutuelle, voiture, RTT…)</span></Label>
            <textarea id="benefits" rows={3} value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="Ex. Tickets restaurant 9€, mutuelle prise en charge à 60%, RTT, télétravail 2 jours/semaine, voiture de fonction…" className={`${inputClass} resize-y`} />
          </FieldGroup>
        </div>
      </Section>

      {/* SECTION 4 */}
      <Section index={4} title="Contact" subtitle="Qui suit ce recrutement chez vous ?" delay={240}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FieldGroup>
            <Label htmlFor="contactName" required>Nom du contact</Label>
            <input id="contactName" required value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="contactEmail" required>Email</Label>
            <input id="contactEmail" type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClass} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="contactPhone" required>Téléphone</Label>
            <input id="contactPhone" type="tel" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="06 12 34 56 78" className={inputClass} />
          </FieldGroup>
        </div>
      </Section>

      {submitError && (
        <div className="rounded-[var(--radius-card)] bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 flex items-start gap-2 animate-fade-up">
          <svg className="h-4 w-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="10" cy="10" r="7" /><path d="M10 6v4m0 3v.01" strokeLinecap="round" />
          </svg>
          <span><strong>Impossible d&apos;envoyer la demande.</strong><br />{submitError}</span>
        </div>
      )}

      <div className="sticky bottom-4 flex flex-col-reverse sm:flex-row gap-3 justify-end bg-white/90 backdrop-blur rounded-[var(--radius-card)] ring-1 ring-neutral-200 shadow-lg p-3">
        <button type="button" onClick={() => router.push("/client/nouvelle-demande")} className="rounded-[var(--radius-button)] bg-white px-4 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50 transition">Retour</button>
        <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-accent-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600 hover:shadow-accent-500/40 disabled:opacity-70 transition-all">
          {submitting ? (<><Spinner />Envoi…</>) : (<>Envoyer la demande<svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4.5 10h11m0 0L10 4.5M15.5 10 10 15.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg></>)}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white px-3 py-2 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15";

const selectClass = `${inputClass} appearance-none cursor-pointer`;

function ChevronIcon() {
  return (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
