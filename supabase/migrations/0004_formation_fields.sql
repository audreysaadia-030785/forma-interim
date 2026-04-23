-- ============================================================
-- ASCV CONSEILS — Migration 0004
-- Champs spécifiques aux demandes de formation.
-- ============================================================

-- Référence vers la formation au catalogue.
alter table public.requests
  add column if not exists formation_id text,
  add column if not exists formation_title text,
  add column if not exists formation_category text;

-- Modalités pédagogiques.
create type public.training_format as enum ('presentiel', 'distanciel', 'hybride');

alter table public.requests
  add column if not exists training_format public.training_format,
  add column if not exists training_audience_level text,
  add column if not exists training_participants int,
  add column if not exists training_duration_days numeric(4,1),
  add column if not exists training_objectives text;

-- Aménagements / accessibilité (Qualiopi).
alter table public.requests
  add column if not exists psh_present boolean not null default false,
  add column if not exists accommodations text[] not null default '{}',
  add column if not exists accommodations_details text;

-- Budget indicatif.
alter table public.requests
  add column if not exists budget_hint text;

-- Pour les formations, headcount et certains champs contrat ne sont pas requis.
-- Les colonnes héritées (start_date, location, contract_type…) restent
-- optionnelles ; on les remplit quand pertinent.
