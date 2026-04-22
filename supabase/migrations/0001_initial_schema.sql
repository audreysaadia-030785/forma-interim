-- ============================================================
-- Forma Interim — Schéma initial de la base
-- À exécuter dans l'éditeur SQL de Supabase (Project → SQL Editor)
-- ============================================================

-- Extension pour générer des UUID (normalement déjà activée sur Supabase).
create extension if not exists "uuid-ossp";

-- ============================================================
-- Table : profiles
-- Stocke les infos liées à un compte auth.users (créé par Supabase Auth).
-- Le champ role distingue "admin" (Forma Interim) de "client" (entreprise).
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'client')),
  full_name text not null,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ============================================================
-- Table : clients
-- Entreprises clientes. Un profile peut être rattaché à un client.
-- ============================================================
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  siret text,
  primary_contact_name text not null,
  email text not null,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  -- Profil auth du contact principal (nullable car le compte peut être créé plus tard)
  primary_user_id uuid references public.profiles(id) on delete set null
);

alter table public.clients enable row level security;

-- ============================================================
-- Table : requests  (demandes de personnel)
-- ============================================================
create type public.request_status as enum
  ('pending', 'proposed', 'validated', 'refused', 'cancelled');

create type public.duration_unit as enum ('jours', 'semaines', 'mois');

create table if not exists public.requests (
  id uuid primary key default uuid_generate_v4(),
  -- Numéro lisible (ex. REQ-2026-0001) généré par trigger plus bas
  reference text unique not null,
  client_id uuid not null references public.clients(id) on delete cascade,
  -- Le profile qui a créé la demande (peut différer du primary_user_id du client)
  created_by uuid references public.profiles(id) on delete set null,

  -- Le poste
  job_label text not null,
  rome_code text,
  headcount int not null check (headcount >= 1),
  habilitations text[] not null default '{}',
  custom_habilitations text[] not null default '{}',
  description text,

  -- Planning & lieu
  start_date date not null,
  duration_value int not null,
  duration_unit public.duration_unit not null,
  location text not null,

  -- Rémunération
  hourly_rate_eur numeric(6,2) not null,
  meal_bonus_eur numeric(6,2),
  travel_bonus_eur numeric(6,2),
  transport_allowance_eur numeric(6,2),
  other_premium text,

  -- Contact côté client
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,

  -- Pièce jointe (chemin dans le bucket job-specs)
  job_spec_path text,

  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.requests enable row level security;

create index if not exists idx_requests_client_id on public.requests(client_id);
create index if not exists idx_requests_status on public.requests(status);
create index if not exists idx_requests_created_at on public.requests(created_at desc);

-- ============================================================
-- Table : candidates  (base de candidats gérée par l'admin)
-- ============================================================
create table if not exists public.candidates (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  headline text,
  experience_years int,
  -- Chemin du CV dans le bucket candidate-cvs
  cv_path text,
  cv_file_name text,
  added_at timestamptz not null default now()
);

alter table public.candidates enable row level security;

-- ============================================================
-- Table : proposals  (candidats proposés pour une demande)
-- ============================================================
create type public.proposal_status as enum ('pending', 'validated', 'refused');

create table if not exists public.proposals (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references public.requests(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  status public.proposal_status not null default 'pending',
  proposed_at timestamptz not null default now(),
  decided_at timestamptz,
  unique (request_id, candidate_id)
);

alter table public.proposals enable row level security;

create index if not exists idx_proposals_request on public.proposals(request_id);
create index if not exists idx_proposals_candidate on public.proposals(candidate_id);

-- ============================================================
-- Trigger : génération automatique de la reference des demandes
-- Format : REQ-{YYYY}-{NNNN} (NNNN = numéro croissant dans l'année)
-- ============================================================
create or replace function public.generate_request_reference()
returns trigger
language plpgsql
as $$
declare
  this_year text := to_char(now(), 'YYYY');
  next_num int;
begin
  if new.reference is not null then
    return new;
  end if;
  select coalesce(max(substring(reference from 'REQ-\d{4}-(\d+)')::int), 0) + 1
    into next_num
  from public.requests
  where reference like 'REQ-' || this_year || '-%';
  new.reference := 'REQ-' || this_year || '-' || lpad(next_num::text, 4, '0');
  return new;
end;
$$;

create trigger trg_generate_request_reference
  before insert on public.requests
  for each row
  execute function public.generate_request_reference();

-- ============================================================
-- Trigger : updated_at automatique
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_requests_updated_at
  before update on public.requests
  for each row
  execute function public.touch_updated_at();

-- ============================================================
-- Politiques RLS (Row-Level Security)
-- ============================================================

-- Helper : un profile est-il admin ?
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

-- Helper : quel client est rattaché à ce profile ?
create or replace function public.client_id_of(uid uuid)
returns uuid
language sql
stable
as $$
  select id from public.clients where primary_user_id = uid limit 1;
$$;

-- profiles : chacun voit et modifie son propre profil ; les admins voient tout.
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id or public.is_admin(auth.uid()));
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles admin all" on public.profiles
  for all using (public.is_admin(auth.uid()));

-- clients : admin a tout ; client voit son propre enregistrement.
create policy "clients admin all" on public.clients
  for all using (public.is_admin(auth.uid()));
create policy "clients self select" on public.clients
  for select using (primary_user_id = auth.uid());

-- requests : admin a tout ; un client ne voit que ses propres demandes
-- et ne peut créer que pour son client_id.
create policy "requests admin all" on public.requests
  for all using (public.is_admin(auth.uid()));
create policy "requests client select" on public.requests
  for select using (client_id = public.client_id_of(auth.uid()));
create policy "requests client insert" on public.requests
  for insert with check (client_id = public.client_id_of(auth.uid()));
create policy "requests client cancel" on public.requests
  for update using (
    client_id = public.client_id_of(auth.uid())
    and status in ('pending', 'proposed')
  ) with check (
    client_id = public.client_id_of(auth.uid())
  );

-- candidates : admin only (base interne).
create policy "candidates admin all" on public.candidates
  for all using (public.is_admin(auth.uid()));

-- proposals : admin a tout ; client voit les propositions sur ses demandes
-- et peut mettre à jour le status (valider / refuser).
create policy "proposals admin all" on public.proposals
  for all using (public.is_admin(auth.uid()));
create policy "proposals client select" on public.proposals
  for select using (
    exists (
      select 1 from public.requests r
      where r.id = request_id
        and r.client_id = public.client_id_of(auth.uid())
    )
  );
create policy "proposals client update" on public.proposals
  for update using (
    exists (
      select 1 from public.requests r
      where r.id = request_id
        and r.client_id = public.client_id_of(auth.uid())
    )
  );

-- ============================================================
-- Auto-création du profile à la création d'un auth.users
-- (rôle par défaut = 'client', sera promu 'admin' manuellement pour Audrey)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger trg_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
