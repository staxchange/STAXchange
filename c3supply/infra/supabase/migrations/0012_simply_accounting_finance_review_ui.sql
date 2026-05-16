-- Simply Accounting finance review UI workflow support.
-- Adds rejection/archive metadata placeholders for export review.

create table if not exists simply_accounting_finance_review_actions (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  action text not null,
  actor_id uuid,
  reason text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table simply_accounting_finance_review_actions enable row level security;

-- Policy model:
-- FINANCE / ADMIN / SUPER_ADMIN can create and view review actions.
-- no public access.
-- service role server adapter writes through commands only.
