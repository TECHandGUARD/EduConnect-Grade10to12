-- GuardCommerce foundation: merchant data isolation with PostgreSQL RLS.
create extension if not exists pgcrypto;
create table if not exists public.merchants (
 id uuid primary key default gen_random_uuid(),
 name text not null check (length(trim(name)) between 2 and 120),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 owner_id uuid not null references auth.users(id),
 created_at timestamptz not null default now()
);
create table if not exists public.merchant_members (
 merchant_id uuid not null references public.merchants(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null check (role in ('owner','admin','staff')),
 primary key (merchant_id,user_id)
);
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 merchant_id uuid not null references public.merchants(id) on delete cascade,
 title text not null check (length(trim(title)) between 1 and 200),
 description text not null default '',
 price_cents bigint not null check (price_cents >= 0),
 currency text not null default 'ZAR' check (currency ~ '^[A-Z]{3}$'),
 inventory_count integer not null default 0 check (inventory_count >= 0),
 status text not null default 'draft' check (status in ('draft','active','archived')),
 created_at timestamptz not null default now()
);
create index if not exists products_merchant_idx on public.products(merchant_id);
create index if not exists merchant_members_user_idx on public.merchant_members(user_id);
create or replace function public.is_merchant_member(p_merchant_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.merchant_members m
 where m.merchant_id = p_merchant_id and m.user_id = (select auth.uid()));
$$;
create or replace function public.is_merchant_admin(p_merchant_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
 select exists (select 1 from public.merchant_members m
 where m.merchant_id = p_merchant_id and m.user_id = (select auth.uid()) and m.role in ('owner','admin'));
$$;
create or replace function public.create_merchant(p_name text,p_slug text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
 if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
 if length(trim(p_name)) not between 2 and 120 or p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
   raise exception 'Invalid merchant name or slug';
 end if;
 insert into public.merchants(name,slug,owner_id) values(trim(p_name),p_slug,(select auth.uid())) returning id into new_id;
 insert into public.merchant_members(merchant_id,user_id,role) values(new_id,(select auth.uid()),'owner');
 return new_id;
end; $$;
revoke all on function public.create_merchant(text,text) from public;
grant execute on function public.create_merchant(text,text) to authenticated;
revoke all on function public.is_merchant_member(uuid) from public;
revoke all on function public.is_merchant_admin(uuid) from public;
grant execute on function public.is_merchant_member(uuid), public.is_merchant_admin(uuid) to authenticated;
alter table public.merchants enable row level security;
alter table public.merchant_members enable row level security;
alter table public.products enable row level security;
create policy merchants_select on public.merchants for select to authenticated using (public.is_merchant_member(id));
create policy merchants_update on public.merchants for update to authenticated using (public.is_merchant_admin(id)) with check (public.is_merchant_admin(id));
create policy members_select on public.merchant_members for select to authenticated using (public.is_merchant_member(merchant_id));
create policy products_select on public.products for select to authenticated using (public.is_merchant_member(merchant_id));
create policy products_insert on public.products for insert to authenticated with check (public.is_merchant_member(merchant_id));
create policy products_update on public.products for update to authenticated using (public.is_merchant_member(merchant_id)) with check (public.is_merchant_member(merchant_id));
create policy products_delete on public.products for delete to authenticated using (public.is_merchant_admin(merchant_id));
-- Public storefront read access should use a separately designed limited view/API.
-- Never grant anonymous access to merchant membership or unpublished products.
