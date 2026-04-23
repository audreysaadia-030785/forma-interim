"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  checklistFor,
  progressFor,
  type ChecklistItem,
  type ChecklistState,
} from "@/lib/admin-checklists";
import { toggleChecklistItemAction } from "./checklist-actions";

type Props = {
  requestId: string;
  requestType: string;
  initial: ChecklistState;
};

export function AdminChecklist({ requestId, requestType, initial }: Props) {
  const router = useRouter();
  const [state, setState] = useState<ChecklistState>(() => {
    // La première étape "demande_recue" est toujours cochée automatiquement.
    const items = checklistFor(requestType);
    const next = { ...initial };
    for (const item of items) {
      if (item.auto && !next[item.key]?.done) {
        next[item.key] = { done: true, done_at: new Date().toISOString() };
      }
    }
    return next;
  });
  const [pending, startTransition] = useTransition();

  const items = checklistFor(requestType);
  const { done, total, percent } = progressFor(requestType, state);

  // Regrouper par phase
  const byPhase = useMemo(() => {
    const m = new Map<string, ChecklistItem[]>();
    for (const it of items) {
      const arr = m.get(it.phase);
      if (arr) arr.push(it);
      else m.set(it.phase, [it]);
    }
    return Array.from(m.entries());
  }, [items]);

  function toggle(key: string) {
    if (items.find((i) => i.key === key)?.auto) return; // auto items non modifiables
    const currentDone = state[key]?.done ?? false;
    const optimistic = {
      ...state,
      [key]: { done: !currentDone, done_at: !currentDone ? new Date().toISOString() : null },
    };
    setState(optimistic);
    startTransition(async () => {
      const res = await toggleChecklistItemAction(requestId, key, !currentDone);
      if (!res.ok) {
        alert(`Erreur : ${res.error}`);
        setState(state); // revert
      }
      router.refresh();
    });
  }

  return (
    <section className="rounded-[var(--radius-card)] bg-white ring-1 ring-neutral-200 shadow-sm p-6 animate-fade-up">
      <header className="mb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-lg font-extrabold text-primary-900 flex items-center gap-2">
              📋 Suivi de la demande
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Cochez les étapes au fur et à mesure — la progression est
              visible sur le dashboard.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-bold text-primary-700 ring-1 ring-primary-200">
            {done} / {total}
            <span className="text-primary-500 text-xs font-semibold">
              ({percent}%)
            </span>
          </span>
        </div>

        {/* Barre de progression */}
        <div className="mt-3 h-3 w-full rounded-full bg-neutral-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percent === 100
                ? "bg-emerald-500"
                : percent >= 66
                  ? "bg-primary-600"
                  : percent >= 33
                    ? "bg-accent-500"
                    : "bg-neutral-400"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </header>

      <div className="space-y-5">
        {byPhase.map(([phase, phaseItems]) => {
          const phaseDone = phaseItems.filter((i) => state[i.key]?.done).length;
          const phaseAllDone = phaseDone === phaseItems.length;
          return (
            <div key={phase}>
              <div className="flex items-center gap-2 mb-2">
                <h3
                  className={`text-xs font-bold uppercase tracking-wider ${
                    phaseAllDone ? "text-emerald-700" : "text-primary-700"
                  }`}
                >
                  {phaseAllDone && "✓ "}
                  {phase}
                </h3>
                <span className="text-[10px] font-semibold text-neutral-500">
                  {phaseDone}/{phaseItems.length}
                </span>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>
              <ul className="space-y-1">
                {phaseItems.map((item) => {
                  const isDone = state[item.key]?.done ?? false;
                  const doneAt = state[item.key]?.done_at;
                  return (
                    <li key={item.key}>
                      <label
                        className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer select-none transition ${
                          isDone
                            ? "bg-emerald-50/60 text-neutral-500 line-through hover:bg-emerald-50"
                            : "hover:bg-primary-50 text-primary-900"
                        } ${item.auto ? "cursor-default" : ""} ${pending ? "opacity-60" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          disabled={pending || item.auto}
                          onChange={() => toggle(item.key)}
                          className={`mt-0.5 h-4 w-4 rounded ${
                            isDone
                              ? "text-emerald-600 border-emerald-400 focus:ring-emerald-500"
                              : "border-neutral-300 text-primary-600 focus:ring-primary-500"
                          }`}
                        />
                        <span className="flex-1">
                          <span className={isDone ? "" : "font-semibold"}>
                            {item.label}
                          </span>
                          {item.auto && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-accent-50 px-1.5 py-0.5 text-[9px] font-bold text-accent-700 ring-1 ring-accent-200">
                              AUTO
                            </span>
                          )}
                          {doneAt && isDone && (
                            <span className="block text-[10px] text-neutral-500 font-normal no-underline">
                              le {new Date(doneAt).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {percent === 100 && (
        <div className="mt-5 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-3 text-center">
          <p className="text-sm font-bold text-emerald-800">
            🎉 Demande entièrement traitée
          </p>
        </div>
      )}
    </section>
  );
}
