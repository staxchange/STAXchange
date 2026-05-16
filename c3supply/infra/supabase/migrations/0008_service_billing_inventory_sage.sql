-- Service billing, parts inventory, and Simply Accounting export prep schema.
-- Production RLS must be reviewed before enabling finance workflows.

create table if not exists service_labor_entries (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  technician_id uuid,
  description text not null,
  hours numeric not null,
  rate_cents integer,
  status text not null default 'SUBMITTED',
  created_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists service_invoice_drafts (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  customer_id uuid,
  status text not null default 'DRAFT',
  currency text not null default 'CAD',
  subtotal_cents integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid,
  rejected_at timestamptz,
  rejection_reason text
);

create table if not exists service_invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null,
  kind text not null,
  description text not null,
  quantity numeric not null,
  unit_price_cents integer not null,
  total_cents integer not null,
  created_at timestamptz not null default now()
);

create table if not exists service_billing_packets (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null,
  status text not null default 'CREATED',
  created_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists simply_accounting_export_batches (
  id uuid primary key default gen_random_uuid(),
  batch_number text not null unique,
  status text not null default 'CREATED',
  item_count integer not null default 0,
  created_at timestamptz not null default now(),
  marked_ready_at timestamptz,
  marked_ready_by uuid
);

create table if not exists simply_accounting_export_batch_items (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null,
  invoice_id uuid not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table if not exists service_inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid,
  sku text,
  product_id uuid,
  quantity_delta numeric not null,
  reason text not null,
  review_required boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists service_parts_inventory (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  description text not null,
  quantity_on_hand numeric not null default 0,
  quantity_reserved numeric not null default 0,
  reorder_point numeric,
  status text not null default 'IN_STOCK',
  updated_at timestamptz not null default now()
);

create table if not exists service_maintenance_followups (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null,
  reason text not null,
  target_date date,
  status text not null default 'CREATED',
  created_at timestamptz not null default now(),
  created_by uuid
);

create table if not exists finance_review_events (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid,
  event_type text not null,
  actor_id uuid,
  note text,
  created_at timestamptz not null default now()
);

alter table service_labor_entries enable row level security;
alter table service_invoice_drafts enable row level security;
alter table service_invoice_line_items enable row level security;
alter table service_billing_packets enable row level security;
alter table simply_accounting_export_batches enable row level security;
alter table simply_accounting_export_batch_items enable row level security;
alter table service_inventory_adjustments enable row level security;
alter table service_parts_inventory enable row level security;
alter table service_maintenance_followups enable row level security;
alter table finance_review_events enable row level security;

-- Policy model:
-- technicians create labor/parts entries for assigned work orders.
-- service managers create invoice drafts after approved closeout.
-- finance approves/rejects invoice drafts and prepares Simply Accounting export batches.
-- public access is forbidden.
