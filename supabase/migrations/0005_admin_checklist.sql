-- ============================================================
-- ASCV CONSEILS — Migration 0005
-- Checklist de suivi admin par demande.
-- ============================================================

ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS admin_checklist jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Format du JSON :
-- { "key_step": { "done": true, "done_at": "2026-04-23T10:30:00Z" } }
-- Les clés disponibles sont définies côté app selon le type de demande.
