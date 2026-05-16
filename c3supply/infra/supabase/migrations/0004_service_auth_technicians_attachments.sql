-- Production service auth, technician user model, and file attachment support.

create table if not exists technicians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  email text not null,
  active boolean not null default true,
  territories text[] not null default '{}',
  skills text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists service_attachments (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid references service_requests(id) on delete cascade,
  work_order_id uuid references service_work_orders(id) on delete cascade,
  bucket text not null default 'service-attachments',
  object_path text not null,
  file_name text not null,
  content_type text not null,
  size_bytes integer,
  uploaded_by text,
  created_at timestamptz not null default now(),
  constraint service_attachment_parent_check check (
    service_request_id is not null or work_order_id is not null
  )
);

insert into storage.buckets (id, name, public)
values ('service-attachments', 'service-attachments', false)
on conflict (id) do nothing;

alter table technicians enable row level security;
alter table service_attachments enable row level security;
