-- Role-based access profiles for admin, technician, customer, finance, and reporting surfaces.
-- Production auth provider should map authenticated users to these roles.

create table if not exists app_role_assignments (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null,
  role text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists technician_work_order_access (
  id uuid primary key default gen_random_uuid(),
  technician_id uuid not null,
  work_order_id uuid not null,
  active boolean not null default true,
  assigned_at timestamptz not null default now(),
  assigned_by uuid
);

create table if not exists route_access_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id text,
  role text,
  surface text not null,
  pathname text not null,
  allowed boolean not null,
  reason text,
  created_at timestamptz not null default now()
);

alter table app_role_assignments enable row level security;
alter table technician_work_order_access enable row level security;
alter table route_access_audit_events enable row level security;

-- Policy model:
-- ADMIN / SUPER_ADMIN can manage app_role_assignments.
-- OPS / SERVICE_MANAGER / ADMIN / SUPER_ADMIN can manage technician_work_order_access.
-- Staff can read relevant route_access_audit_events.
-- Customer routes require CUSTOMER role or staff override.
-- Finance export routes require FINANCE / ADMIN / SUPER_ADMIN.
