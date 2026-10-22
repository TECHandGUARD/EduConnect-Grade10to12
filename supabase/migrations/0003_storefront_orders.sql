-- Public catalogue is exposed only via a narrow security-definer RPC.
alter table public.merchants add column if not exists store_description text not null default '';
alter table public.merchants add column if not exists theme_color text not null default '#218567' check (theme_color ~ '^#[0-9A-Fa-f]{6}$');
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(),
 merchant_id uuid not null references public.merchants(id),
 customer_email text not null,
 amount_cents bigint not null check (amount_cents>=0),
 currency text not null default 'ZAR',
 status text not null default 'pending' check (status in ('pending','paid','cancelled','refunded')),
 created_at timestamptz not null default now()
);
create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references public.orders(id) on delete cascade,
 product_id uuid not null references public.products(id),
 title text not null,
 unit_price_cents bigint not null check (unit_price_cents>=0),
 quantity integer not null check (quantity>0),
 merchant_id uuid not null references public.merchants(id)
);
create index if not exists orders_merchant_idx on public.orders(merchant_id,created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
create policy orders_merchant_read on public.orders for select to authenticated using(public.is_merchant_member(merchant_id));
create policy items_merchant_read on public.order_items for select to authenticated using(public.is_merchant_member(merchant_id));
-- No direct client writes to orders or items. Future checkout must be server-side and atomic.
revoke all on public.orders,public.order_items from anon,authenticated;
grant select on public.orders,public.order_items to authenticated;
create or replace function public.storefront_catalogue(p_slug text)
returns table(store_name text,store_description text,theme_color text,product_id uuid,product_title text,product_description text,price_cents bigint,currency text,inventory_count integer)
language sql stable security definer set search_path = '' as $$
 select m.name,m.store_description,m.theme_color,p.id,p.title,p.description,p.price_cents,p.currency,p.inventory_count
 from public.merchants m left join public.products p on p.merchant_id=m.id and p.status='active'
 where m.slug=p_slug;
$$;
revoke all on function public.storefront_catalogue(text) from public;
grant execute on function public.storefront_catalogue(text) to anon,authenticated;
