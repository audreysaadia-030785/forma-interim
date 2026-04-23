-- ============================================================
-- ASCV CONSEILS — Migration 0003
-- Ajout du type de demande (recrutement / formation / RH)
-- + champs spécifiques au recrutement CDD/CDI.
-- À exécuter dans le SQL Editor de Supabase.
-- ============================================================

-- ---- Type de demande ----
create type public.request_type as enum (
  'recrutement',
  'formation',
  'accompagnement_rh'
);

alter table public.requests
  add column if not exists request_type public.request_type
    not null default 'recrutement';

-- ---- Type de contrat (recrutement) ----
create type public.contract_type as enum (
  'cdi',
  'cdd',
  'stage',
  'alternance',
  'freelance'
);

alter table public.requests
  add column if not exists contract_type public.contract_type;

-- Si CDD : durée du contrat en mois.
alter table public.requests
  add column if not exists cdd_duration_months int;

-- ---- Niveau d'expérience attendu ----
create type public.experience_level as enum (
  'junior',
  'confirme',
  'senior',
  'expert'
);

alter table public.requests
  add column if not exists experience_level public.experience_level;

-- ---- Rémunération annuelle ----
alter table public.requests
  add column if not exists salary_min_eur numeric(10,2),
  add column if not exists salary_max_eur numeric(10,2),
  add column if not exists salary_period text
    check (salary_period in ('annual', 'monthly'))
    default 'annual',
  add column if not exists variable_pay text,
  add column if not exists benefits text;

-- ---- Modalités ----
create type public.remote_work as enum (
  'none',     -- 100% présentiel
  'hybrid',   -- hybride
  'full'      -- 100% télétravail
);

alter table public.requests
  add column if not exists remote_work public.remote_work,
  add column if not exists trial_period_months int,
  add column if not exists education_level text;

-- ---- Mise à jour des contraintes existantes ----
-- Le taux horaire devient optionnel (intérim seulement). Les nouvelles demandes
-- recrutement renseignent salary_min_eur / salary_max_eur à la place.
alter table public.requests
  alter column hourly_rate_eur drop not null;

alter table public.requests
  alter column duration_value drop not null;

alter table public.requests
  alter column duration_unit drop not null;
