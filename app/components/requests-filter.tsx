"use client";

import Link from "next/link";
import { STATUS_META, type RequestStatus } from "@/lib/demo-data";

const FILTERS: Array<{ key: RequestStatus | "all"; label: string }> = [
  { key: "all", label: "Toutes" },
  { key: "pending", label: STATUS_META.pending.label },
  { key: "proposed", label: STATUS_META.proposed.label },
  { key: "validated", label: STATUS_META.validated.label },
  { key: "refused", label: STATUS_META.refused.label },
  { key: "cancelled", label: STATUS_META.cancelled.label },
];

export function RequestsFilter({
  current,
}: {
  current: RequestStatus | "all";
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-full bg-white ring-1 ring-neutral-200 p-1 self-start">
      {FILTERS.map((f) => {
        const active = f.key === current;
        return (
          <Link
            key={f.key}
            href={f.key === "all" ? "/client" : `/client?status=${f.key}`}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              active
                ? "bg-primary-600 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-primary-700"
            }`}
          >
            {f.label}
          </Link>
        );
      })}
    </div>
  );
}
