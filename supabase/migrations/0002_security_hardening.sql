-- GuardCommerce follow-up hardening: ownership cannot be reassigned by client updates.
create or replace function public.prevent_merchant_ownership_change()
returns trigger language plpgsql set search_path = '' as $$
begin
 if new.owner_id is distinct from old.owner_id then
   raise exception 'Merchant ownership changes require an audited admin process';
 end if;
 if new.id is distinct from old.id then
   raise exception 'Merchant id is immutable';
 end if;
 return new;
end; $$;
drop trigger if exists merchants_immutable_ownership on public.merchants;
create trigger merchants_immutable_ownership
before update on public.merchants for each row
execute function public.prevent_merchant_ownership_change();

-- Prevent changing product tenant ownership even by a merchant member.
create or replace function public.prevent_product_tenant_change()
returns trigger language plpgsql set search_path = '' as $$
begin
 if new.merchant_id is distinct from old.merchant_id then
   raise exception 'Product tenant cannot be changed';
 end if;
 return new;
end; $$;
drop trigger if exists products_immutable_tenant on public.products;
create trigger products_immutable_tenant
before update on public.products for each row
execute function public.prevent_product_tenant_change();

-- Merchant members cannot insert or change roles directly; membership management
-- will be added via separately authorised and audited server operations.
revoke insert, update, delete on public.merchant_members from anon, authenticated;
revoke insert, update, delete on public.merchants from anon, authenticated;
grant select on public.merchants, public.merchant_members, public.products to authenticated;
grant insert, update, delete on public.products to authenticated;
grant update on public.merchants to authenticated;
