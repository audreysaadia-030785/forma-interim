-- ============================================================
-- ASCV CONSEILS — Migration 0006
-- Module Accompagnement RH : effectifs, rappels, bibliothèque.
-- ============================================================

-- ============================================================
-- Table : hr_employees
-- Liste des salariés d'un client (alimentée par l'admin ou par
-- le client s'il a l'autorisation).
-- ============================================================
create table if not exists public.hr_employees (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.clients(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  job_title text,
  contract_type text check (contract_type in ('cdi', 'cdd', 'alternance', 'stage', 'freelance', 'interim')),
  contract_start_date date,
  contract_end_date date,
  trial_end_date date,
  last_medical_visit_date date,
  next_medical_visit_date date,
  last_entretien_pro_date date,
  next_entretien_pro_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hr_employees enable row level security;

create index if not exists idx_hr_employees_client on public.hr_employees(client_id);

drop trigger if exists trg_hr_employees_updated_at on public.hr_employees;
create trigger trg_hr_employees_updated_at
  before update on public.hr_employees
  for each row
  execute function public.touch_updated_at();

-- ============================================================
-- Table : hr_reminders
-- Rappels / alertes RH pour un client.
-- ============================================================
create table if not exists public.hr_reminders (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  description text,
  category text check (category in (
    'conges', 'visite_medicale', 'entretien_pro', 'formation',
    'duerp', 'legal', 'contrat', 'autre'
  )),
  due_date date not null,
  related_employee_id uuid references public.hr_employees(id) on delete set null,
  done boolean not null default false,
  done_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.hr_reminders enable row level security;

create index if not exists idx_hr_reminders_client on public.hr_reminders(client_id);
create index if not exists idx_hr_reminders_due_date on public.hr_reminders(due_date);

-- ============================================================
-- Table : hr_documents
-- Bibliothèque de documents RH (modèles de contrats, procédures,
-- veille juridique, etc.). Un document peut être "partagé avec
-- tous les clients" (client_id NULL) ou "personnalisé pour un client".
-- ============================================================
create table if not exists public.hr_documents (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade,
  title text not null,
  description text,
  category text check (category in (
    'contrats', 'procedures', 'reglement_interieur',
    'entretiens', 'veille_juridique', 'modeles', 'autre'
  )),
  file_path text,
  file_name text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.hr_documents enable row level security;

create index if not exists idx_hr_documents_client on public.hr_documents(client_id);
create index if not exists idx_hr_documents_category on public.hr_documents(category);

-- ============================================================
-- Politiques RLS
-- ============================================================

-- hr_employees : admin a tout, client voit/gère les siens.
create policy "hr_employees admin all" on public.hr_employees
  for all using (public.is_admin(auth.uid()));
create policy "hr_employees client select" on public.hr_employees
  for select using (client_id = public.client_id_of(auth.uid()));

-- hr_reminders : admin a tout, client voit les siens et peut cocher done.
create policy "hr_reminders admin all" on public.hr_reminders
  for all using (public.is_admin(auth.uid()));
create policy "hr_reminders client select" on public.hr_reminders
  for select using (client_id = public.client_id_of(auth.uid()));
create policy "hr_reminders client update done" on public.hr_reminders
  for update using (client_id = public.client_id_of(auth.uid()));

-- hr_documents : admin a tout, client voit les partagés + les siens.
create policy "hr_documents admin all" on public.hr_documents
  for all using (public.is_admin(auth.uid()));
create policy "hr_documents client select" on public.hr_documents
  for select using (
    client_id is null
    or client_id = public.client_id_of(auth.uid())
  );
