-- DWG Commerce Activation Phase 1: governed catalog, cart intent, quote review, and order draft.
-- No public direct mutation. Apps route through packages/commands and server-side repositories only.

create table if not exists product_categories (id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, summary text, active boolean not null default true, created_at timestamptz not null default now());
create table if not exists products (id uuid primary key default gen_random_uuid(), slug text not null unique, category_slug text not null, name text not null, summary text not null, approval_status text not null default 'DRAFT', availability text not null default 'QUOTE_ONLY', quote_required boolean not null default true, checkout_eligible boolean not null default false, created_at timestamptz not null default now());
create table if not exists product_variants (id uuid primary key default gen_random_uuid(), product_id uuid not null, sku text, name text not null, availability text not null default 'QUOTE_ONLY', quote_required boolean not null default true, checkout_eligible boolean not null default false, created_at timestamptz not null default now());
create table if not exists product_media (id uuid primary key default gen_random_uuid(), product_id uuid not null, kind text not null, url text not null, alt text not null, approved boolean not null default false, created_at timestamptz not null default now());
create table if not exists carts (id uuid primary key default gen_random_uuid(), customer_email text, status text not null default 'ACTIVE', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists cart_items (id uuid primary key default gen_random_uuid(), cart_id uuid not null, product_id uuid not null, name text not null, quantity numeric not null, quote_required boolean not null default true, checkout_eligible boolean not null default false, unit_price_cents integer, currency text default 'CAD', created_at timestamptz not null default now());
create table if not exists commerce_quote_requests (id uuid primary key default gen_random_uuid(), cart_id uuid, customer_name text not null, customer_email text not null, status text not null default 'QUOTE_REQUESTED', human_review_required boolean not null default true, created_at timestamptz not null default now());
create table if not exists commerce_quote_drafts (id uuid primary key default gen_random_uuid(), request_id uuid not null, status text not null default 'QUOTE_DRAFTED', review_status text not null default 'NOT_SUBMITTED', subtotal_cents integer not null default 0, currency text not null default 'CAD', created_at timestamptz not null default now());
create table if not exists commerce_quote_lines (id uuid primary key default gen_random_uuid(), quote_id uuid not null, product_id uuid not null, description text not null, quantity numeric not null, unit_price_cents integer, quote_required boolean not null default true, created_at timestamptz not null default now());
create table if not exists commerce_orders (id uuid primary key default gen_random_uuid(), quote_id uuid not null, status text not null default 'CREATED', fulfillment_status text not null default 'PENDING', billing_readiness text not null default 'NOT_READY', created_at timestamptz not null default now());
create table if not exists commerce_order_lines (id uuid primary key default gen_random_uuid(), order_id uuid not null, product_id uuid not null, description text not null, quantity numeric not null, unit_price_cents integer, created_at timestamptz not null default now());
create table if not exists commerce_audit_events (id uuid primary key default gen_random_uuid(), actor_id text, actor_role text, action text not null, workflow text not null default 'commerce-quote', entity_id text, request_id text, metadata jsonb not null default '{}', created_at timestamptz not null default now());

alter table product_categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_media enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table commerce_quote_requests enable row level security;
alter table commerce_quote_drafts enable row level security;
alter table commerce_quote_lines enable row level security;
alter table commerce_orders enable row level security;
alter table commerce_order_lines enable row level security;
alter table commerce_audit_events enable row level security;

-- Policy model:
-- Public can read published catalog only through safe API/projection.
-- Public/customer cart and quote intent must route through command-backed API routes.
-- Sales/OPS/Admin review quotes and create order drafts from accepted quotes.
-- No direct public mutation policies should be enabled without command/server validation.
