-- Photo quote intake workflow.
-- Operator photo intake only. Human quote review is required. No public direct mutation.

create table if not exists photo_quote_intakes (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text,
  customer_phone text,
  site_name text not null,
  site_location text,
  operator_id text not null,
  priority text not null default 'STANDARD',
  status text not null default 'PHOTO_INTAKE_CREATED',
  notes text not null,
  human_review_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists photo_quote_photos (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null,
  storage_bucket text not null default 'service-attachments',
  storage_path text not null,
  photo_type text not null,
  uploaded_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists equipment_extraction_candidates (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null,
  extraction_candidate_json jsonb not null default '{}',
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists photo_quote_review_events (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null,
  event_type text not null,
  actor_id text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists photo_quote_audit_events (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null,
  action text not null,
  actor_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table photo_quote_intakes enable row level security;
alter table photo_quote_photos enable row level security;
alter table equipment_extraction_candidates enable row level security;
alter table photo_quote_review_events enable row level security;
alter table photo_quote_audit_events enable row level security;

-- Policy model:
-- TECHNICIAN / OPS / SALES may create intakes and attach photos through commands.
-- SERVICE_MANAGER / OPS / ADMIN may review and convert to commerce quote.
-- No public direct table mutation.
-- Storage bucket: service-attachments.
