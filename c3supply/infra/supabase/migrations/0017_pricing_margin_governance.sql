-- Pricing and margin governance.
-- Supplier cost tables are internal only. No public direct mutation.

create table if not exists supplier_cost_sources (
  id uuid primary key default gen_random_uuid(),
  supplier_name text not null,
  source_document_id text,
  source_type text not null,
  currency text not null,
  created_at timestamptz not null default now()
);

create table if not exists supplier_cost_records (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  supplier_name text not null,
  cost_cents integer not null,
  currency text not null,
  cost_level text not null default 'SINGLE_PURCHASE',
  status text not null default 'DRAFT',
  effective_at timestamptz not null default now(),
  stale_after_days integer not null default 30,
  created_at timestamptz not null default now()
);

create table if not exists margin_rules (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null,
  target_margin_percent numeric not null,
  minimum_margin_percent numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists pricing_reviews (
  id uuid primary key default gen_random_uuid(),
  quote_id text not null,
  status text not null,
  review_required boolean not null default true,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists quote_pricing_snapshots (
  id uuid primary key default gen_random_uuid(),
  quote_id text not null,
  currency text not null,
  sell_price_cents integer not null,
  supplier_cost_cents integer,
  supplier_cost_currency text,
  margin_percent numeric,
  pricing_approved boolean not null default false,
  pricing_locked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists quote_pricing_approval_events (
  id uuid primary key default gen_random_uuid(),
  quote_id text not null,
  approved_by text,
  status text not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists currency_conversion_snapshots (
  id uuid primary key default gen_random_uuid(),
  from_currency text not null,
  to_currency text not null,
  rate numeric not null,
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists freight_estimate_placeholders (
  id uuid primary key default gen_random_uuid(),
  quote_id text not null,
  status text not null default 'PLACEHOLDER',
  note text not null
);

alter table supplier_cost_sources enable row level security;
alter table supplier_cost_records enable row level security;
alter table margin_rules enable row level security;
alter table pricing_reviews enable row level security;
alter table quote_pricing_snapshots enable row level security;
alter table quote_pricing_approval_events enable row level security;
alter table currency_conversion_snapshots enable row level security;
alter table freight_estimate_placeholders enable row level security;

-- Policy model:
-- FINANCE/ADMIN/SUPER_ADMIN manage supplier costs and pricing approvals.
-- SALES/OPS may create reviews and apply margin rules.
-- PUBLIC/CUSTOMER receive no supplier cost access.
