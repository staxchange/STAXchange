-- Fulfillment and supplier purchase order prep. No automatic fulfillment or supplier PO sending.
create table if not exists fulfillment_plans (id uuid primary key default gen_random_uuid(), order_id text not null, quote_id text, payment_id text, customer_id text, fulfillment_status text not null default 'FULFILLMENT_PLAN_CREATED', review_required boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists fulfillment_plan_lines (id uuid primary key default gen_random_uuid(), fulfillment_plan_id uuid, product_id text not null, quantity integer not null, fulfillment_route text not null, created_at timestamptz not null default now());
create table if not exists fulfillment_inventory_decisions (id uuid primary key default gen_random_uuid(), fulfillment_plan_id uuid, fulfillment_route text not null, decided_by text, note text, created_at timestamptz not null default now());
create table if not exists fulfillment_requests (id uuid primary key default gen_random_uuid(), fulfillment_plan_id uuid, fulfillment_status text not null default 'FULFILLMENT_REQUEST_CREATED', created_at timestamptz not null default now());
create table if not exists shipment_placeholders (id uuid primary key default gen_random_uuid(), fulfillment_request_id uuid, shipment_carrier text, tracking_reference text, shipment_confirmed_at timestamptz, created_at timestamptz not null default now());
create table if not exists customer_fulfillment_events (id uuid primary key default gen_random_uuid(), order_id text, customer_id text, event_type text not null, customer_notified_at timestamptz, created_at timestamptz not null default now());
create table if not exists supplier_purchase_order_drafts (id uuid primary key default gen_random_uuid(), fulfillment_plan_id uuid, supplier_name text not null, supplier_po_status text not null default 'SUPPLIER_PO_DRAFTED', review_required boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists supplier_purchase_order_lines (id uuid primary key default gen_random_uuid(), supplier_po_id uuid, product_id text not null, quantity integer not null, created_at timestamptz not null default now());
create table if not exists supplier_po_review_events (id uuid primary key default gen_random_uuid(), supplier_po_id uuid, event_type text not null, actor_id text, created_at timestamptz not null default now());
create table if not exists dropship_requests (id uuid primary key default gen_random_uuid(), supplier_po_id uuid, supplier_name text not null, status text not null default 'DROPSHIP_REQUEST_PREPARED', storage_bucket text, storage_path text, created_at timestamptz not null default now());
create table if not exists fulfillment_audit_events (id uuid primary key default gen_random_uuid(), entity_id text not null, action text not null, actor_id text, metadata jsonb not null default '{}', created_at timestamptz not null default now());
alter table fulfillment_plans enable row level security;
alter table fulfillment_plan_lines enable row level security;
alter table fulfillment_inventory_decisions enable row level security;
alter table fulfillment_requests enable row level security;
alter table shipment_placeholders enable row level security;
alter table customer_fulfillment_events enable row level security;
alter table supplier_purchase_order_drafts enable row level security;
alter table supplier_purchase_order_lines enable row level security;
alter table supplier_po_review_events enable row level security;
alter table dropship_requests enable row level security;
alter table fulfillment_audit_events enable row level security;
-- Policy model: internal fulfillment/supplier PO data is staff-only. Public/customer access is safe-status projection only. No public direct mutation.
