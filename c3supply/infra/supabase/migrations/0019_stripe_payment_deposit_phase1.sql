-- Stripe deposit and payment capture phase 1.
-- Payment data is internal/customer-safe only. No public direct table mutation. No accounting sync.

create table if not exists payment_requests (
  id uuid primary key default gen_random_uuid(),
  quote_id text not null,
  order_id text,
  customer_id text,
  customer_email text,
  provider text not null default 'STRIPE',
  status text not null default 'PAYMENT_REQUEST_DRAFTED',
  currency text not null,
  amount_cents integer not null,
  deposit_required boolean not null default false,
  deposit_amount_cents integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quote_payments (
  id uuid primary key default gen_random_uuid(),
  quote_id text not null,
  payment_request_id uuid not null,
  status text not null,
  amount_cents integer not null,
  currency text not null,
  created_at timestamptz not null default now()
);

create table if not exists stripe_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  payment_request_id uuid not null,
  stripe_checkout_session_id text,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists stripe_payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_request_id uuid,
  stripe_event_id text,
  stripe_payment_intent_id text,
  status text not null,
  failure_reason text,
  created_at timestamptz not null default now()
);

create table if not exists payment_audit_events (
  id uuid primary key default gen_random_uuid(),
  payment_request_id uuid,
  action text not null,
  actor_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists refund_review_requests (
  id uuid primary key default gen_random_uuid(),
  payment_request_id uuid not null,
  refund_review_reason text not null,
  requested_by text,
  created_at timestamptz not null default now()
);

alter table payment_requests enable row level security;
alter table quote_payments enable row level security;
alter table stripe_checkout_sessions enable row level security;
alter table stripe_payment_events enable row level security;
alter table payment_audit_events enable row level security;
alter table refund_review_requests enable row level security;

-- Policy model:
-- Customer/public may create checkout only through command after approved payment request.
-- FINANCE/ADMIN manage payment approval and event review.
-- No supplier cost exposure. No accounting sync.
