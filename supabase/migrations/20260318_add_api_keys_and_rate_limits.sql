create table if not exists public.user_api_keys (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null,
  label text not null default 'Default key'::text,
  key_prefix text not null,
  key_hash text not null,
  last_used_at timestamp with time zone null,
  revoked_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint user_api_keys_pkey primary key (id),
  constraint user_api_keys_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade,
  constraint user_api_keys_key_hash_key unique (key_hash)
);

create index if not exists user_api_keys_user_id_idx
  on public.user_api_keys using btree (user_id, created_at desc);

create table if not exists public.api_request_events (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null,
  api_key_id uuid null,
  endpoint text not null,
  status_code integer not null,
  request_at timestamp with time zone not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint api_request_events_pkey primary key (id),
  constraint api_request_events_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade,
  constraint api_request_events_api_key_id_fkey foreign key (api_key_id) references public.user_api_keys(id) on delete set null
);

create index if not exists api_request_events_user_request_at_idx
  on public.api_request_events using btree (user_id, request_at desc);

alter table public.user_api_keys enable row level security;
alter table public.api_request_events enable row level security;

drop policy if exists "users can read their own api keys" on public.user_api_keys;
create policy "users can read their own api keys"
  on public.user_api_keys
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users can read their own api events" on public.api_request_events;
create policy "users can read their own api events"
  on public.api_request_events
  for select
  to authenticated
  using (auth.uid() = user_id);

grant select on public.user_api_keys to authenticated;
grant select on public.api_request_events to authenticated;
