"use client";

import { useRef, useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { fr } from "date-fns/locale";

type Props = {
  id?: string;
  value: string; // format ISO YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  minDate?: Date;
  placeholder?: string;
};

/** Composant interactif : input + calendrier popup en cliquant. */
export function DatePicker({
  id,
  value,
  onChange,
  required,
  minDate,
  placeholder = "Sélectionner une date",
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Ferme le popup au clic extérieur.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value ? parseIsoDate(value) : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const disabledBefore = minDate ?? today;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 rounded-[var(--radius-button)] border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-primary-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
      >
        <span
          className={`flex items-center gap-2 ${selectedDate ? "text-primary-900 font-semibold" : "text-neutral-400"}`}
        >
          <svg
            className="h-4 w-4 text-primary-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" strokeLinecap="round" />
          </svg>
          {selectedDate
            ? selectedDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : placeholder}
        </span>
        <svg
          className={`h-4 w-4 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
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
      </button>

      {required && (
        <input
          type="hidden"
          name={id}
          required
          value={value}
          readOnly
        />
      )}

      {open && (
        <div className="mt-2 bg-white rounded-[var(--radius-card)] ring-1 ring-neutral-200 shadow-xl p-3 animate-fade-up">
          <DayPicker
            mode="single"
            locale={fr}
            selected={selectedDate}
            onSelect={(d) => {
              if (!d) return;
              onChange(toIsoDate(d));
              setOpen(false);
            }}
            disabled={{ before: disabledBefore }}
            showOutsideDays
            weekStartsOn={1}
            classNames={{
              root: "rdp-root-ascv",
              caption_label: "font-bold text-primary-900",
              nav_button:
                "inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-primary-50 text-primary-700",
              button_next:
                "inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-primary-50 text-primary-700",
              button_previous:
                "inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-primary-50 text-primary-700",
              weekday: "text-[11px] font-bold text-neutral-500 uppercase",
              day_button:
                "h-9 w-9 rounded-full text-sm font-semibold hover:bg-primary-50 hover:text-primary-700 focus:outline-none",
              selected:
                "!bg-primary-700 !text-white hover:!bg-primary-800 focus:!ring-2 focus:!ring-primary-500",
              today: "text-accent-600 font-extrabold",
              disabled: "!text-neutral-300 cursor-not-allowed hover:bg-transparent",
              outside: "text-neutral-300",
            }}
          />
        </div>
      )}
    </div>
  );
}

function toIsoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
