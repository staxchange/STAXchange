-- Quote documents and customer acceptance workflow.
-- Generated from approved commerce quote only. No public direct mutation.

create table if not exists quote_documents (
  id uuid primary key default gen_random_uuid(),
  commerce_quote_id uuid not null,
  customer_name text not null,
  customer_email text,
  status text not null default 'DOCUMENT_DRAFTED',
  approved_commerce_quote boolean not null default false,
  document_approved boolean not null default false,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists quote_document_lines (id uuid primary key default gen_random_uuid(), quote_document_id uuid not null, description text not null, quantity numeric not null, unit_price_cents integer, total_cents integer, human_reviewed boolean not null default false, created_at timestamptz not null default now());
create table if not exists quote_share_links (id uuid primary key default gen_random_uuid(), quote_document_id uuid not null, token text not null unique, expires_at timestamptz not null, created_at timestamptz not null default now());
create table if not exists quote_view_events (id uuid primary key default gen_random_uuid(), quote_document_id uuid not null, viewer_id text, token text, created_at timestamptz not null default now());
create table if not exists quote_acceptance_events (id uuid primary key default gen_random_uuid(), quote_document_id uuid not null, accepted_by text not null, terms_accepted boolean not null default true, created_at timestamptz not null default now());
create table if not exists quote_revision_requests (id uuid primary key default gen_random_uuid(), quote_document_id uuid not null, requested_by text not null, reason text not null, created_at timestamptz not null default now());
create table if not exists quote_expiry_events (id uuid primary key default gen_random_uuid(), quote_document_id uuid not null, expired_by text not null, reason text, created_at timestamptz not null default now());

alter table quote_documents enable row level security;
alter table quote_document_lines enable row level security;
alter table quote_share_links enable row level security;
alter table quote_view_events enable row level security;
alter table quote_acceptance_events enable row level security;
alter table quote_revision_requests enable row level security;
alter table quote_expiry_events enable row level security;

-- Policy model:
-- SALES/OPS may prepare reviewed quote documents through commands.
-- ADMIN/SUPER_ADMIN may approve documents.
-- PUBLIC/CUSTOMER may view/accept/request revision only through command-gated routes and valid share links.
-- No direct public table mutation.
