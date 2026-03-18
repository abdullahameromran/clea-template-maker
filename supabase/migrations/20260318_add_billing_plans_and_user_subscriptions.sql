create table if not exists public.billing_plans (
  id uuid not null default extensions.uuid_generate_v4(),
  code text not null,
  name text not null,
  badge text null,
  description text null,
  monthly_price_min numeric null,
  monthly_price_max numeric null,
  currency text not null default 'USD'::text,
  is_custom boolean not null default false,
  invoices_per_month integer null,
  requests_per_second integer null,
  team_seats integer null,
  api_access_level text not null default 'none'::text,
  watermark_enabled boolean not null default false,
  custom_branding_enabled boolean not null default false,
  automation_workflows_enabled boolean not null default false,
  template_saving_enabled boolean not null default false,
  priority_processing_enabled boolean not null default false,
  advanced_templates_enabled boolean not null default false,
  invoice_history_storage_enabled boolean not null default false,
  dedicated_server_enabled boolean not null default false,
  white_label_enabled boolean not null default false,
  dedicated_support_enabled boolean not null default false,
  bulk_generation_enabled boolean not null default false,
  sla_percent numeric null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint billing_plans_pkey primary key (id),
  constraint billing_plans_code_key unique (code),
  constraint billing_plans_api_access_level_check check (
    api_access_level = any (array['none'::text, 'basic'::text, 'full'::text, 'enterprise'::text])
  )
);

create index if not exists billing_plans_sort_order_idx
  on public.billing_plans using btree (sort_order, is_active);

create table if not exists public.user_subscriptions (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null,
  plan_id uuid not null,
  status text not null default 'active'::text,
  billing_cycle text not null default 'monthly'::text,
  provider text not null default 'manual'::text,
  current_period_start timestamp with time zone null,
  current_period_end timestamp with time zone null,
  cancel_at_period_end boolean not null default false,
  custom_price numeric null,
  currency text not null default 'USD'::text,
  external_customer_id text null,
  external_subscription_id text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint user_subscriptions_pkey primary key (id),
  constraint user_subscriptions_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade,
  constraint user_subscriptions_plan_id_fkey foreign key (plan_id) references public.billing_plans(id) on delete restrict,
  constraint user_subscriptions_status_check check (
    status = any (
      array[
        'trialing'::text,
        'active'::text,
        'past_due'::text,
        'cancelled'::text,
        'incomplete'::text,
        'incomplete_expired'::text
      ]
    )
  ),
  constraint user_subscriptions_billing_cycle_check check (
    billing_cycle = any (array['monthly'::text, 'yearly'::text, 'custom'::text])
  ),
  constraint user_subscriptions_provider_check check (
    provider = any (array['manual'::text, 'stripe'::text, 'paddle'::text, 'custom'::text])
  )
);

create index if not exists user_subscriptions_user_id_created_at_idx
  on public.user_subscriptions using btree (user_id, created_at desc);

create unique index if not exists user_subscriptions_single_active_plan_idx
  on public.user_subscriptions using btree (user_id)
  where status = any (array['trialing'::text, 'active'::text, 'past_due'::text]);

create table if not exists public.user_monthly_usage (
  id uuid not null default extensions.uuid_generate_v4(),
  user_id uuid not null,
  usage_month date not null,
  invoices_generated integer not null default 0,
  api_requests integer not null default 0,
  saved_templates integer not null default 0,
  automation_runs integer not null default 0,
  last_activity_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint user_monthly_usage_pkey primary key (id),
  constraint user_monthly_usage_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade,
  constraint user_monthly_usage_month_key unique (user_id, usage_month),
  constraint user_monthly_usage_usage_month_check check (
    usage_month = date_trunc('month', usage_month::timestamp with time zone)::date
  ),
  constraint user_monthly_usage_invoices_generated_check check (invoices_generated >= 0),
  constraint user_monthly_usage_api_requests_check check (api_requests >= 0),
  constraint user_monthly_usage_saved_templates_check check (saved_templates >= 0),
  constraint user_monthly_usage_automation_runs_check check (automation_runs >= 0)
);

create index if not exists user_monthly_usage_user_month_idx
  on public.user_monthly_usage using btree (user_id, usage_month desc);

insert into public.billing_plans (
  code,
  name,
  badge,
  description,
  monthly_price_min,
  monthly_price_max,
  currency,
  is_custom,
  invoices_per_month,
  requests_per_second,
  team_seats,
  api_access_level,
  watermark_enabled,
  custom_branding_enabled,
  automation_workflows_enabled,
  template_saving_enabled,
  priority_processing_enabled,
  advanced_templates_enabled,
  invoice_history_storage_enabled,
  dedicated_server_enabled,
  white_label_enabled,
  dedicated_support_enabled,
  bulk_generation_enabled,
  sla_percent,
  sort_order,
  metadata
)
values
  (
    'free',
    'Free Tier',
    'Starter',
    '100 invoices per month with all templates, basic PDF generation, and InvoiceHub watermark.',
    0,
    0,
    'USD',
    false,
    100,
    1,
    1,
    'basic',
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    null,
    1,
    jsonb_build_object('goal', 'onboarding + virality')
  ),
  (
    'pro',
    'Pro Tier',
    'Most Popular',
    'Best-selling plan for branded invoices, saved templates, API access, and priority processing.',
    9,
    19,
    'USD',
    false,
    1000,
    5,
    1,
    'basic',
    false,
    true,
    false,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    null,
    2,
    jsonb_build_object('goal', 'primary monetization')
  ),
  (
    'business',
    'Business Tier',
    'Scale',
    'High-volume plan for SaaS apps, marketplaces, and agencies with team seats and workflow automation.',
    29,
    49,
    'USD',
    false,
    10000,
    10,
    3,
    'full',
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    null,
    3,
    jsonb_build_object('audience', jsonb_build_array('saas apps', 'marketplaces', 'agencies'))
  ),
  (
    'enterprise',
    'Enterprise Tier',
    'Custom',
    'Unlimited usage with dedicated infrastructure, SLA, white-label, and custom integrations.',
    null,
    null,
    'USD',
    true,
    null,
    null,
    null,
    'enterprise',
    false,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    99.9,
    4,
    jsonb_build_object('notes', 'Custom pricing and dedicated support')
  )
on conflict (code) do update
set
  name = excluded.name,
  badge = excluded.badge,
  description = excluded.description,
  monthly_price_min = excluded.monthly_price_min,
  monthly_price_max = excluded.monthly_price_max,
  currency = excluded.currency,
  is_custom = excluded.is_custom,
  invoices_per_month = excluded.invoices_per_month,
  requests_per_second = excluded.requests_per_second,
  team_seats = excluded.team_seats,
  api_access_level = excluded.api_access_level,
  watermark_enabled = excluded.watermark_enabled,
  custom_branding_enabled = excluded.custom_branding_enabled,
  automation_workflows_enabled = excluded.automation_workflows_enabled,
  template_saving_enabled = excluded.template_saving_enabled,
  priority_processing_enabled = excluded.priority_processing_enabled,
  advanced_templates_enabled = excluded.advanced_templates_enabled,
  invoice_history_storage_enabled = excluded.invoice_history_storage_enabled,
  dedicated_server_enabled = excluded.dedicated_server_enabled,
  white_label_enabled = excluded.white_label_enabled,
  dedicated_support_enabled = excluded.dedicated_support_enabled,
  bulk_generation_enabled = excluded.bulk_generation_enabled,
  sla_percent = excluded.sla_percent,
  sort_order = excluded.sort_order,
  metadata = excluded.metadata,
  updated_at = now();

create or replace function public.assign_free_subscription_to_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  free_plan_uuid uuid;
begin
  select id
    into free_plan_uuid
  from public.billing_plans
  where code = 'free'
  limit 1;

  if free_plan_uuid is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.user_subscriptions
    where user_id = new.id
      and status = any (array['trialing'::text, 'active'::text, 'past_due'::text])
  ) then
    insert into public.user_subscriptions (
      user_id,
      plan_id,
      status,
      billing_cycle,
      provider,
      current_period_start,
      current_period_end,
      metadata
    )
    values (
      new.id,
      free_plan_uuid,
      'active',
      'monthly',
      'manual',
      now(),
      now() + interval '1 month',
      jsonb_build_object('source', 'signup_default')
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_assign_free_plan on auth.users;
create trigger on_auth_user_created_assign_free_plan
  after insert on auth.users
  for each row
  execute function public.assign_free_subscription_to_user();

insert into public.user_subscriptions (
  user_id,
  plan_id,
  status,
  billing_cycle,
  provider,
  current_period_start,
  current_period_end,
  metadata
)
select
  users.id,
  free_plan.id,
  'active',
  'monthly',
  'manual',
  now(),
  now() + interval '1 month',
  jsonb_build_object('source', 'migration_backfill')
from auth.users as users
cross join lateral (
  select id
  from public.billing_plans
  where code = 'free'
  limit 1
) as free_plan
where not exists (
  select 1
  from public.user_subscriptions as subs
  where subs.user_id = users.id
    and subs.status = any (array['trialing'::text, 'active'::text, 'past_due'::text])
);

alter table public.billing_plans enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.user_monthly_usage enable row level security;

drop policy if exists "billing plans are readable by everyone" on public.billing_plans;
create policy "billing plans are readable by everyone"
  on public.billing_plans
  for select
  using (is_active = true);

drop policy if exists "users can read their own subscriptions" on public.user_subscriptions;
create policy "users can read their own subscriptions"
  on public.user_subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users can read their own monthly usage" on public.user_monthly_usage;
create policy "users can read their own monthly usage"
  on public.user_monthly_usage
  for select
  to authenticated
  using (auth.uid() = user_id);

grant select on public.billing_plans to anon, authenticated;
grant select on public.user_subscriptions to authenticated;
grant select on public.user_monthly_usage to authenticated;
