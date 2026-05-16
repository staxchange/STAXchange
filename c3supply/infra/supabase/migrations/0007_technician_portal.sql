-- DWG technician portal placeholder schema.
-- Service-role server adapters and command lifecycle must mediate protected writes.
-- RLS is enabled and policy comments/stubs document the production boundary.

create table if not exists technician_sessions (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null,
  actor_id uuid,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists technician_work_order_events (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  technician_id uuid,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists technician_checklist_items (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  template_item_id text not null,
  label text not null,
  completed boolean not null default false,
  completed_by uuid,
  completed_at timestamptz
);

create table if not exists technician_visit_notes (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  technician_id uuid not null,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists service_photos (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  technician_id uuid,
  bucket text not null,
  object_path text not null,
  content_type text not null,
  uploaded_at timestamptz not null default now()
);

create table if not exists service_closeouts (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  technician_id uuid not null,
  findings text not null,
  actions_taken text not null,
  follow_up_required boolean not null default false,
  status text not null default 'MANAGER_REVIEW_REQUIRED',
  submitted_at timestamptz not null default now()
);

create table if not exists manager_reviews (
  id uuid primary key default gen_random_uuid(),
  closeout_id uuid not null,
  reviewer_id uuid not null,
  status text not null,
  reason text,
  reviewed_at timestamptz not null default now()
);

alter table technician_sessions enable row level security;
alter table technician_work_order_events enable row level security;
alter table technician_checklist_items enable row level security;
alter table technician_visit_notes enable row level security;
alter table service_photos enable row level security;
alter table service_closeouts enable row level security;
alter table manager_reviews enable row level security;

-- Policy model:
-- technicians can read assigned work orders and create notes/checklist/photo/parts/closeout records for assigned work orders.
-- service managers can review closeouts.
-- ops/admin/super_admin can manage all technician portal workflow records.
-- no public access to technician portal tables.
