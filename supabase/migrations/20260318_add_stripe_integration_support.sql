alter table public.billing_plans
  add column if not exists stripe_product_id text null,
  add column if not exists stripe_price_id_monthly text null,
  add column if not exists stripe_price_id_yearly text null;

alter table public.user_subscriptions
  add column if not exists checkout_session_id text null,
  add column if not exists provider_payload jsonb not null default '{}'::jsonb;

create unique index if not exists user_subscriptions_external_subscription_id_uidx
  on public.user_subscriptions using btree (external_subscription_id)
  where external_subscription_id is not null;

create table if not exists public.stripe_webhook_events (
  id uuid not null default extensions.uuid_generate_v4(),
  stripe_event_id text not null,
  stripe_event_type text not null,
  livemode boolean not null default false,
  processed_at timestamp with time zone not null default now(),
  payload jsonb not null default '{}'::jsonb,
  constraint stripe_webhook_events_pkey primary key (id),
  constraint stripe_webhook_events_stripe_event_id_key unique (stripe_event_id)
);

alter table public.stripe_webhook_events enable row level security;

revoke all on public.stripe_webhook_events from anon, authenticated;
