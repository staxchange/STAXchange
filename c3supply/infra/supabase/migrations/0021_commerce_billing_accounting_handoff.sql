-- Commerce billing and Simply Accounting handoff. Prep only; no direct accounting sync.
create table if not exists commerce_invoice_drafts (id uuid primary key default gen_random_uuid(), quote_id text not null, order_id text not null, payment_id text not null, fulfillment_id text not null, customer_id text, customer_email text, invoice_status text not null, currency text not null, invoice_subtotal_cents integer not null, tax_placeholder_cents integer not null default 0, freight_placeholder_cents integer not null default 0, invoice_total_cents integer not null, payment_reconciled boolean not null default false, finance_review_required boolean not null default true, approved_by text, approved_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists commerce_invoice_lines (id uuid primary key default gen_random_uuid(), invoice_id uuid not null, description text not null, quantity numeric not null, unit_price_cents integer not null, line_total_cents integer not null, created_at timestamptz not null default now());
create table if not exists commerce_billing_packets (id uuid primary key default gen_random_uuid(), invoice_id uuid not null, billing_packet_status text not null, created_at timestamptz not null default now());
create table if not exists commerce_payment_reconciliations (id uuid primary key default gen_random_uuid(), invoice_id uuid not null, payment_id text not null, payment_reconciled boolean not null, created_at timestamptz not null default now());
create table if not exists commerce_tax_placeholders (id uuid primary key default gen_random_uuid(), invoice_id uuid not null, tax_placeholder_cents integer not null, created_at timestamptz not null default now());
create table if not exists commerce_freight_placeholders (id uuid primary key default gen_random_uuid(), invoice_id uuid not null, freight_placeholder_cents integer not null, created_at timestamptz not null default now());
create table if not exists commerce_invoice_review_events (id uuid primary key default gen_random_uuid(), invoice_id uuid not null, event_type text not null, actor_id text, created_at timestamptz not null default now());
create table if not exists accounting_handoffs (id uuid primary key default gen_random_uuid(), invoice_id uuid not null, billing_packet_id uuid not null, export_status text not null, export_batch_id text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists simply_accounting_export_readiness (id uuid primary key default gen_random_uuid(), handoff_id uuid not null, ready boolean not null default false, created_at timestamptz not null default now());
create table if not exists accounting_reconciliation_notes (id uuid primary key default gen_random_uuid(), handoff_id uuid not null, reconciliation_note text not null, created_by text, created_at timestamptz not null default now());
create table if not exists accounting_export_events (id uuid primary key default gen_random_uuid(), handoff_id uuid not null, event_type text not null, created_at timestamptz not null default now());
create table if not exists commerce_billing_audit_events (id uuid primary key default gen_random_uuid(), entity_id text not null, action text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now());
alter table commerce_invoice_drafts enable row level security;
alter table commerce_invoice_lines enable row level security;
alter table commerce_billing_packets enable row level security;
alter table commerce_payment_reconciliations enable row level security;
alter table commerce_tax_placeholders enable row level security;
alter table commerce_freight_placeholders enable row level security;
alter table commerce_invoice_review_events enable row level security;
alter table accounting_handoffs enable row level security;
alter table simply_accounting_export_readiness enable row level security;
alter table accounting_reconciliation_notes enable row level security;
alter table accounting_export_events enable row level security;
alter table commerce_billing_audit_events enable row level security;
-- FINANCE/ADMIN manage invoice approval and accounting handoff. PUBLIC/CUSTOMER receive safe status only. No supplier cost exposure. No direct accounting sync.
