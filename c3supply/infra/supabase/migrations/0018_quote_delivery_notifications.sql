-- Quote delivery, stored document snapshots, share links, customer actions, and delivery notifications.
-- Customer/public paths use commands/API routes only. No public direct table mutation.

create table if not exists quote_deliveries (
  id uuid primary key default gen_random_uuid(),
  quote_id text not null,
  quote_document_id text not null,
  quote_pricing_snapshot_id text not null,
  customer_id text,
  customer_email text,
  channel text not null,
  status text not null default 'DELIVERY_DRAFTED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quote_stored_documents (
  id uuid primary key default gen_random_uuid(),
  quote_delivery_id text not null,
  quote_document_id text not null,
  storage_bucket text not null default 'quote-documents',
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists quote_share_tokens (
  id uuid primary key default gen_random_uuid(),
  quote_delivery_id text not null,
  token_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists quote_notification_events (
  id uuid primary key default gen_random_uuid(),
  quote_delivery_id text not null,
  channel text not null,
  status text not null,
  failure_reason text,
  created_at timestamptz not null default now()
);

create table if not exists customer_quote_action_events (
  id uuid primary key default gen_random_uuid(),
  quote_delivery_id text not null,
  action text not null,
  viewed_at timestamptz,
  accepted_at timestamptz,
  revision_requested_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists quote_delivery_audit_events (
  id uuid primary key default gen_random_uuid(),
  quote_delivery_id text not null,
  action text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table quote_deliveries enable row level security;
alter table quote_stored_documents enable row level security;
alter table quote_share_tokens enable row level security;
alter table quote_notification_events enable row level security;
alter table customer_quote_action_events enable row level security;
alter table quote_delivery_audit_events enable row level security;

-- Policy model:
-- SALES/OPS create delivery, store document, create share token, send notification through commands.
-- PUBLIC/CUSTOMER can record view/accept/revision only through command-backed API routes.
-- FINANCE/ADMIN/SUPER_ADMIN can fail/expire/close.
-- No supplier cost exposure.
-- Storage bucket: quote-documents.
