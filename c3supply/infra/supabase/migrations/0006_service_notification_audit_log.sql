-- Service notification delivery log for Teams/email/CRM integrations.

create table if not exists service_notification_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  destination text not null,
  service_request_id uuid,
  work_order_id uuid,
  delivered boolean not null default false,
  error text,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table service_notification_events enable row level security;

create policy if not exists "service staff can read service notifications"
on service_notification_events for select
to authenticated
using (public.stax_is_staff());

create policy if not exists "ops admins can manage service notifications"
on service_notification_events for all
to authenticated
using (public.stax_is_ops_admin())
with check (public.stax_is_ops_admin());
