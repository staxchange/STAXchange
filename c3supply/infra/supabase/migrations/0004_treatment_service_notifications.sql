-- Treatment systems service notification and repository-wiring placeholders.
-- Production RLS and service-role write boundaries must be reviewed before activation.

create table if not exists service_notifications (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid,
  work_order_id uuid,
  notification_type text not null,
  destination text,
  delivered boolean not null default false,
  error text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists service_repository_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  event_type text not null,
  request_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table service_notifications enable row level security;
alter table service_repository_events enable row level security;
