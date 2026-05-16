-- Hardened RLS policies for treatment service interface.
-- These policies use app_metadata.role. Keep service-role writes server-only.

create or replace function public.stax_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role', 'CUSTOMER')
$$;

create or replace function public.stax_is_staff()
returns boolean
language sql
stable
as $$
  select public.stax_role() in ('SALES', 'OPS', 'ADMIN', 'SUPER_ADMIN')
$$;

create or replace function public.stax_is_ops_admin()
returns boolean
language sql
stable
as $$
  select public.stax_role() in ('OPS', 'ADMIN', 'SUPER_ADMIN')
$$;

-- Treatment systems
create policy if not exists "service staff can read treatment systems"
on treatment_systems for select
to authenticated
using (public.stax_is_staff());

create policy if not exists "ops admins can manage treatment systems"
on treatment_systems for all
to authenticated
using (public.stax_is_ops_admin())
with check (public.stax_is_ops_admin());

-- Service requests
create policy if not exists "service staff can read service requests"
on service_requests for select
to authenticated
using (public.stax_is_staff());

create policy if not exists "ops admins can manage service requests"
on service_requests for all
to authenticated
using (public.stax_is_ops_admin())
with check (public.stax_is_ops_admin());

-- Work orders
create policy if not exists "service staff can read work orders"
on service_work_orders for select
to authenticated
using (public.stax_is_staff());

create policy if not exists "ops admins can manage work orders"
on service_work_orders for all
to authenticated
using (public.stax_is_ops_admin())
with check (public.stax_is_ops_admin());

-- Service visits
create policy if not exists "service staff can read service visits"
on service_visits for select
to authenticated
using (public.stax_is_staff());

create policy if not exists "ops admins can manage service visits"
on service_visits for all
to authenticated
using (public.stax_is_ops_admin())
with check (public.stax_is_ops_admin());

-- Technician assignments
create policy if not exists "service staff can read technician assignments"
on technician_assignments for select
to authenticated
using (public.stax_is_staff());

create policy if not exists "ops admins can manage technician assignments"
on technician_assignments for all
to authenticated
using (public.stax_is_ops_admin())
with check (public.stax_is_ops_admin());

-- Technicians
create policy if not exists "service staff can read technicians"
on technicians for select
to authenticated
using (public.stax_is_staff());

create policy if not exists "admins can manage technicians"
on technicians for all
to authenticated
using (public.stax_role() in ('ADMIN', 'SUPER_ADMIN'))
with check (public.stax_role() in ('ADMIN', 'SUPER_ADMIN'));

-- Service attachments
create policy if not exists "service staff can read service attachments"
on service_attachments for select
to authenticated
using (public.stax_is_staff());

create policy if not exists "ops admins can manage service attachments"
on service_attachments for all
to authenticated
using (public.stax_is_ops_admin())
with check (public.stax_is_ops_admin());

-- Storage objects for service attachments
create policy if not exists "service staff can read service storage objects"
on storage.objects for select
to authenticated
using (bucket_id = 'service-attachments' and public.stax_is_staff());

create policy if not exists "ops admins can write service storage objects"
on storage.objects for insert
to authenticated
with check (bucket_id = 'service-attachments' and public.stax_is_ops_admin());
