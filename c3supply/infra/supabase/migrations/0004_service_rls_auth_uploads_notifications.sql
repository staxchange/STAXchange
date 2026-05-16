-- Service interface production hardening.
-- Adds technician/user profiles, upload tracking, notification tracking, and RLS policies.

create table if not exists service_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null check (role in ('CUSTOMER','TECHNICIAN','OPS','ADMIN','SUPER_ADMIN')),
  technician_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_technicians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  display_name text not null,
  email text,
  phone text,
  active boolean not null default true,
  region text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table treatment_systems add column if not exists customer_email text;
alter table service_requests add column if not exists triage_reason text;
alter table service_requests add column if not exists assigned_team text;
alter table service_work_orders add column if not exists service_visit_id uuid;

create table if not exists service_uploads (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid,
  work_order_id uuid,
  bucket text not null,
  object_path text not null,
  content_type text not null,
  purpose text not null,
  upload_status text not null default 'SIGNED_URL_CREATED',
  created_at timestamptz not null default now(),
  uploaded_at timestamptz
);

create table if not exists service_notifications (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid,
  work_order_id uuid,
  destination text not null,
  event text not null,
  delivered boolean not null default false,
  error text,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('service-uploads', 'service-uploads', false)
on conflict (id) do nothing;

create schema if not exists private;

create or replace function private.current_service_role()
returns text
language sql
security definer
set search_path = public
as $$
  select sp.role
  from service_profiles sp
  where sp.user_id = auth.uid()
  limit 1;
$$;

create or replace function private.has_service_role(allowed text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(private.current_service_role() = any(allowed), false);
$$;

alter table service_profiles enable row level security;
alter table service_technicians enable row level security;
alter table service_uploads enable row level security;
alter table service_notifications enable row level security;

-- Existing service tables should remain RLS-enabled.
alter table treatment_systems enable row level security;
alter table service_requests enable row level security;
alter table service_work_orders enable row level security;
alter table service_visits enable row level security;
alter table service_parts_used enable row level security;
alter table technician_assignments enable row level security;
alter table audit_events enable row level security;

drop policy if exists "service profiles can read own profile" on service_profiles;
create policy "service profiles can read own profile"
on service_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "service admins can manage profiles" on service_profiles;
create policy "service admins can manage profiles"
on service_profiles
for all
to authenticated
using (private.has_service_role(array['ADMIN','SUPER_ADMIN']))
with check (private.has_service_role(array['ADMIN','SUPER_ADMIN']));

drop policy if exists "service staff can read technicians" on service_technicians;
create policy "service staff can read technicians"
on service_technicians
for select
to authenticated
using (private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service admins can manage technicians" on service_technicians;
create policy "service admins can manage technicians"
on service_technicians
for all
to authenticated
using (private.has_service_role(array['OPS','ADMIN','SUPER_ADMIN']))
with check (private.has_service_role(array['OPS','ADMIN','SUPER_ADMIN']));

drop policy if exists "service staff can read treatment systems" on treatment_systems;
create policy "service staff can read treatment systems"
on treatment_systems
for select
to authenticated
using (private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service staff can read service requests" on service_requests;
create policy "service staff can read service requests"
on service_requests
for select
to authenticated
using (private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service staff can update service requests" on service_requests;
create policy "service staff can update service requests"
on service_requests
for update
to authenticated
using (private.has_service_role(array['OPS','ADMIN','SUPER_ADMIN']))
with check (private.has_service_role(array['OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service staff can read work orders" on service_work_orders;
create policy "service staff can read work orders"
on service_work_orders
for select
to authenticated
using (private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service staff can update work orders" on service_work_orders;
create policy "service staff can update work orders"
on service_work_orders
for update
to authenticated
using (private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN']))
with check (private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service staff can read visits" on service_visits;
create policy "service staff can read visits"
on service_visits
for select
to authenticated
using (private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service staff can create visits" on service_visits;
create policy "service staff can create visits"
on service_visits
for insert
to authenticated
with check (private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service staff can read uploads" on service_uploads;
create policy "service staff can read uploads"
on service_uploads
for select
to authenticated
using (private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service staff can read notifications" on service_notifications;
create policy "service staff can read notifications"
on service_notifications
for select
to authenticated
using (private.has_service_role(array['OPS','ADMIN','SUPER_ADMIN']))
;

drop policy if exists "service staff can read audit events" on audit_events;
create policy "service staff can read audit events"
on audit_events
for select
to authenticated
using (private.has_service_role(array['ADMIN','SUPER_ADMIN']))
;

-- Storage object policies for private service uploads.
drop policy if exists "service staff can read service upload objects" on storage.objects;
create policy "service staff can read service upload objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'service-uploads'
  and private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN'])
);

drop policy if exists "service staff can insert service upload objects" on storage.objects;
create policy "service staff can insert service upload objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'service-uploads'
  and private.has_service_role(array['TECHNICIAN','OPS','ADMIN','SUPER_ADMIN'])
);
