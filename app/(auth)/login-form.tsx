"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      { email, password },
    );

    if (signInError || !data.user) {
      setLoading(false);
      setError(
        signInError?.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : signInError?.message ?? "Erreur de connexion.",
      );
      return;
    }

    // Récupérer le rôle pour savoir où rediriger.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    router.push(profile?.role === "admin" ? "/admin" : "/client");
    router.refresh();
  }

  async function handlePasswordReset() {
    if (!email) {
      setError("Saisissez votre email puis cliquez de nouveau sur « Oublié ? ».");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` },
    );
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      alert(
        `Un email de réinitialisation a été envoyé à ${email}.\nVérifiez votre boîte de réception.`,
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field
        id="email"
        label="Adresse email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={setEmail}
        placeholder="vous@entreprise.fr"
      />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-primary-900"
          >
            Mot de passe
          </label>
          <button
            type="button"
            className="text-xs font-medium text-primary-600 hover:text-accent-500 transition-colors"
            onClick={handlePasswordReset}
          >
            Oublié ?
          </button>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white px-4 py-2.5 pr-11 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 hover:text-primary-600 transition-colors"
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-[var(--radius-button)] bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700 flex items-start gap-2">
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
          <span>{error}</span>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-neutral-600 select-none">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
        />
        Se souvenir de moi
      </label>

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-[var(--radius-button)] bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700 hover:shadow-primary-600/30 focus:outline-none focus:ring-4 focus:ring-primary-500/25 disabled:opacity-70"
      >
        <span
          className={`inline-flex items-center justify-center gap-2 transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}
        >
          Se connecter
          <ArrowIcon />
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </span>
        )}
      </button>
    </form>
  );
}

/* --- Sous-composants --- */

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required,
  placeholder,
  value,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-primary-900">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[var(--radius-button)] border border-neutral-300 bg-white px-4 py-2.5 text-sm text-primary-900 placeholder:text-neutral-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/15"
      />
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.98 8.223A10.477 10.477 0 0 0 2.036 11.68a1.012 1.012 0 0 0 0 .639A10.51 10.51 0 0 0 12 19.5c1.77 0 3.447-.43 4.923-1.192M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639a10.523 10.523 0 0 1-4.132 5.411M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.167 10h11.666m0 0L10 4.167M15.833 10 10 15.833"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
