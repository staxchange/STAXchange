-- Simply Accounting export file preparation.
-- This is finance-reviewed file/batch prep only. It does not directly post to accounting.

create table if not exists simply_accounting_export_files (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  file_name text not null,
  mime_type text not null default 'text/csv',
  row_count integer not null default 0,
  storage_path text,
  generated_by uuid,
  generated_at timestamptz not null default now()
);

create table if not exists simply_accounting_export_manifests (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  batch_number text not null,
  status text not null,
  format text not null default 'CSV_REVIEW_BATCH',
  manifest jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid
);

alter table simply_accounting_export_files enable row level security;
alter table simply_accounting_export_manifests enable row level security;

-- Policy model:
-- finance/admin can generate and review export files.
-- no public access.
-- service role server adapter may write through commands only.
