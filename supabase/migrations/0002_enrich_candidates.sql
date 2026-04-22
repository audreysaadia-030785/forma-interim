-- ============================================================
-- Forma Interim — Migration 0002 : enrichissement de la CVthèque
-- À exécuter dans le SQL Editor de Supabase.
-- ============================================================

-- Colonnes "identité & contact"
alter table public.candidates
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists location text;

-- Métier(s)
alter table public.candidates
  add column if not exists primary_rome_code text,
  add column if not exists primary_rome_label text,
  add column if not exists secondary_rome_codes text[] not null default '{}';

-- Expérience détaillée (tableau d'objets JSON)
-- Format attendu : [{ "title", "company", "start_year", "end_year", "description" }, ...]
alter table public.candidates
  add column if not exists experiences jsonb not null default '[]'::jsonb,
  add column if not exists education jsonb not null default '[]'::jsonb,
  add column if not exists languages jsonb not null default '[]'::jsonb;

-- Habilitations / formations / permis / compétences (tableaux de strings)
alter table public.candidates
  add column if not exists habilitations text[] not null default '{}',
  add column if not exists permis text[] not null default '{}',
  add column if not exists skills text[] not null default '{}';

-- Mobilité & disponibilité
alter table public.candidates
  add column if not exists mobility_radius_km int,
  add column if not exists available_from date,
  add column if not exists preferred_contract_types text[] not null default '{}';

-- Rémunération attendue
alter table public.candidates
  add column if not exists expected_hourly_rate_min_eur numeric(6,2),
  add column if not exists expected_hourly_rate_max_eur numeric(6,2);

-- Notes internes & tags admin
alter table public.candidates
  add column if not exists internal_notes text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists rating int check (rating between 1 and 5);

-- Timestamps de suivi
alter table public.candidates
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists last_contacted_at timestamptz;

-- Trigger updated_at
drop trigger if exists trg_candidates_updated_at on public.candidates;
create trigger trg_candidates_updated_at
  before update on public.candidates
  for each row
  execute function public.touch_updated_at();

-- Index de recherche (accélère les filtres)
create index if not exists idx_candidates_primary_rome on public.candidates(primary_rome_code);
create index if not exists idx_candidates_available_from on public.candidates(available_from);
create index if not exists idx_candidates_habilitations_gin on public.candidates using gin(habilitations);
create index if not exists idx_candidates_tags_gin on public.candidates using gin(tags);

-- Vue complète en lecture (utile si on veut filtrer sur tout d'un coup côté app)
create or replace view public.candidates_full as
  select
    c.*,
    (
      select count(*) from public.proposals p where p.candidate_id = c.id
    ) as proposals_count,
    (
      select count(*) from public.proposals p
      where p.candidate_id = c.id and p.status = 'validated'
    ) as validations_count
  from public.candidates c;

grant select on public.candidates_full to authenticated;
