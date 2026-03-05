create table if not exists public.template_calculations (
  id uuid not null default extensions.uuid_generate_v4(),
  template_id uuid not null,
  sort_order integer not null default 0,
  output_key text not null,
  operation text not null,
  operand_a text null,
  operand_b text null,
  operand_c text null,
  format text null,
  description text null,
  created_at timestamp with time zone not null default now(),
  constraint template_calculations_pkey primary key (id),
  constraint template_calculations_template_id_fkey foreign key (template_id) references invoice_templates (id) on delete cascade,
  constraint template_calculations_format_check check (
    format = any (array['money'::text, 'percent'::text, 'number'::text, 'string'::text, null::text])
  ),
  constraint template_calculations_operation_check check (
    operation = any (
      array[
        'sum_line_items'::text,
        'multiply'::text,
        'divide'::text,
        'add'::text,
        'subtract'::text,
        'percent_of'::text,
        'add_percent'::text,
        'literal'::text,
        'format_money'::text,
        'conditional'::text
      ]
    )
  )
);

create index if not exists template_calculations_template_id_sort_order_idx
  on public.template_calculations using btree (template_id, sort_order);
