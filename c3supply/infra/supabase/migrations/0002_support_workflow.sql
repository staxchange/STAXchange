-- AI support intake and human handoff placeholder schema.
-- Production command handlers should write these tables only from packages/commands.

create table if not exists support_conversations (
  id text primary key,
  brand_id text not null default 'dwg',
  customer_email text,
  status text not null default 'AI_TRIAGE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists support_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null references support_conversations(id),
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null references support_conversations(id),
  status text not null default 'HUMAN_REVIEW_REQUIRED',
  severity text not null default 'NORMAL',
  reason text not null,
  summary text not null,
  assignee_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

alter table support_conversations enable row level security;
alter table support_messages enable row level security;
alter table support_tickets enable row level security;
