-- Simply Accounting export storage, signed downloads, export history, and reconciliation notes.
-- Finance-only workflow. No direct accounting sync.

create table if not exists simply_accounting_download_approvals (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  approved_by uuid,
  status text not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists simply_accounting_signed_downloads (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  file_id uuid not null,
  url text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists simply_accounting_export_history (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  event_type text not null,
  actor_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists simply_accounting_reconciliation_notes (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  note text not null,
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table simply_accounting_download_approvals enable row level security;
alter table simply_accounting_signed_downloads enable row level security;
alter table simply_accounting_export_history enable row level security;
alter table simply_accounting_reconciliation_notes enable row level security;

-- Storage bucket expected:
-- simply-accounting-export-files
--
-- Policy model:
-- FINANCE / ADMIN / SUPER_ADMIN can review, approve, create signed downloads, mark exported/failed, and reconcile.
-- no public access.
-- service role server adapter writes through commands only.
