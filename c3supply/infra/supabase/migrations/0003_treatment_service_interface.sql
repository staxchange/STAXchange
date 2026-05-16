-- Treatment systems service-interface placeholder schema.
-- Production must review RLS policies before enabling real service workflow writes.

create table if not exists treatment_systems (
  id uuid primary key default gen_random_uuid(),
  brand_id text not null default 'dwg',
  customer_id uuid,
  site_name text,
  site_address text,
  system_type text not null default 'UNKNOWN',
  manufacturer text,
  model text,
  serial_number text,
  installed_at timestamptz,
  last_serviced_at timestamptz,
  next_service_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  brand_id text not null default 'dwg',
  treatment_system_id uuid,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  company text,
  site_address text,
  issue_description text not null,
  category text not null,
  severity text not null,
  status text not null default 'NEW',
  emergency_escalation boolean not null default false,
  preferred_service_window text,
  site_access_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists service_work_orders (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid not null,
  status text not null default 'CREATED',
  priority text not null default 'STANDARD',
  summary text not null,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  technician_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_visits (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  technician_id uuid not null,
  started_at timestamptz,
  completed_at timestamptz,
  findings text,
  actions_taken text,
  follow_up_required boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists service_parts_used (
  id uuid primary key default gen_random_uuid(),
  service_visit_id uuid not null,
  product_id uuid,
  sku text,
  description text not null,
  quantity numeric not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists technician_assignments (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  technician_id uuid not null,
  assigned_by uuid,
  assigned_at timestamptz not null default now()
);

alter table treatment_systems enable row level security;
alter table service_requests enable row level security;
alter table service_work_orders enable row level security;
alter table service_visits enable row level security;
alter table service_parts_used enable row level security;
alter table technician_assignments enable row level security;
