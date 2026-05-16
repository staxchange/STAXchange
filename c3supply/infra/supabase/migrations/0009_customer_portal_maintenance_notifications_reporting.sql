-- Customer portal, maintenance plans, notifications, and reporting snapshots.
-- Public access is forbidden. Customer access requires verified auth and RLS policies.

create table if not exists customer_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid,
  email text not null unique,
  name text,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists customer_portal_sessions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  status text not null default 'CREATED',
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists customer_system_links (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  treatment_system_id uuid not null,
  access_level text not null default 'VIEW_ONLY',
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists customer_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  email_enabled boolean not null default true,
  service_updates_enabled boolean not null default true,
  maintenance_reminders_enabled boolean not null default true,
  billing_updates_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists maintenance_plans (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  treatment_system_id uuid,
  status text not null default 'DRAFT',
  frequency text not null,
  next_visit_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists maintenance_plan_events (
  id uuid primary key default gen_random_uuid(),
  maintenance_plan_id uuid not null,
  event_type text not null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists notification_queue (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  template_id text not null,
  recipient text not null,
  payload jsonb not null default '{}',
  status text not null default 'QUEUED',
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create table if not exists notification_dispatch_events (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null,
  status text not null,
  provider_message_id text,
  error text,
  created_at timestamptz not null default now()
);

create table if not exists service_kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  open_service_requests integer not null default 0,
  emergency_escalations integer not null default 0,
  completed_work_orders integer not null default 0,
  average_response_hours numeric,
  created_at timestamptz not null default now()
);

create table if not exists billing_kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  invoice_drafts integer not null default 0,
  invoices_approved integer not null default 0,
  sage_batches_ready integer not null default 0,
  total_approved_cents integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists inventory_kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  low_stock_items integer not null default 0,
  out_of_stock_items integer not null default 0,
  pending_adjustments integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists ops_report_snapshots (
  id uuid primary key default gen_random_uuid(),
  service_snapshot_id uuid,
  billing_snapshot_id uuid,
  inventory_snapshot_id uuid,
  report_date date not null,
  created_at timestamptz not null default now()
);

alter table customer_profiles enable row level security;
alter table customer_portal_sessions enable row level security;
alter table customer_system_links enable row level security;
alter table customer_notification_preferences enable row level security;
alter table maintenance_plans enable row level security;
alter table maintenance_plan_events enable row level security;
alter table notification_queue enable row level security;
alter table notification_dispatch_events enable row level security;
alter table service_kpi_snapshots enable row level security;
alter table billing_kpi_snapshots enable row level security;
alter table inventory_kpi_snapshots enable row level security;
alter table ops_report_snapshots enable row level security;

-- Policy model:
-- customers can read only their own linked systems, visible service history, approved invoices, and notification preferences.
-- ops/admin can manage maintenance plans and notifications.
-- reporting/admin can create KPI/reporting snapshots.
-- service role server adapter may write through commands only.
