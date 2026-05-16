-- STAX ecommerce shell + DWG dress initial placeholder schema.
-- Production must review RLS and policies before enabling real protected mutation paths.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  brand_id text not null,
  slug text not null,
  name text not null,
  status text not null default 'DRAFT',
  quote_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  deleted_at timestamptz
);

create table if not exists product_pricing (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null,
  source_cost_cents integer not null,
  retail_price_cents integer not null,
  margin_percent numeric not null,
  approved boolean not null default false,
  fresh_until timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  brand_id text not null,
  company text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  details text not null,
  status text not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  brand_id text not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fulfillment_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  status text not null default 'REQUESTED',
  created_at timestamptz not null default now()
);

create table if not exists audit_events (
  id text primary key,
  actor_id text not null,
  actor_role text not null,
  action text not null,
  workflow text not null,
  entity_id text,
  request_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists capital_signals (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  summary text not null,
  read_only boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
alter table product_pricing enable row level security;
alter table quotes enable row level security;
alter table orders enable row level security;
alter table fulfillment_requests enable row level security;
alter table audit_events enable row level security;
alter table capital_signals enable row level security;
