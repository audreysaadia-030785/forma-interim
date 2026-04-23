"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleReminderDoneAction } from "@/app/admin/rh/actions";

export function ReminderToggle({ id, done: initialDone }: { id: string; done: boolean }) {
  const router = useRouter();
  const [done, setDone] = useState(initialDone);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    const next = !done;
    setDone(next);
    startTransition(async () => {
      const res = await toggleReminderDoneAction(id, next);
      if (!res.ok) {
        alert(`Erreur : ${res.error}`);
        setDone(!next);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <input
      type="checkbox"
      checked={done}
      disabled={pending}
      onChange={handleToggle}
      className="mt-1 h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
      aria-label="Marquer comme traité"
    />
  );
}
