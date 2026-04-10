begin;

create extension if not exists "pgcrypto";

create type public.order_status as enum (
  'pending',
  'processed',
  'dispatched',
  'out-for-delivery',
  'delivered',
  'cancelled'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  email text not null unique,
  name text not null,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid
      and p.role = 'admin'
  );
$$;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  images jsonb not null default '[]'::jsonb,
  category text not null,
  base_price numeric not null default 0,
  weights jsonb not null default '[]'::jsonb,
  rating numeric not null default 0,
  reviews integer not null default 0,
  trending boolean not null default false,
  deal jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  customer jsonb not null default '{}'::jsonb,
  total numeric not null default 0,
  status public.order_status not null default 'pending',
  payment jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  image text not null,
  title text not null,
  weight_label text not null,
  weight_kg integer not null,
  unit_price numeric not null,
  quantity integer not null default 1 check (quantity > 0),
  subtotal numeric not null default 0
);

create index products_active_idx on public.products(active);
create index products_trending_idx on public.products(trending);
create index orders_user_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);
create index order_items_order_idx on public.order_items(order_id);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email, ''),
    new.email,
    case
      when lower(new.email) = 'admin@mangogrove.com' then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Profiles read own or admin"
on public.profiles
for select
using (id = auth.uid() or public.is_admin(auth.uid()));

create policy "Profiles insert own"
on public.profiles
for insert
with check (id = auth.uid() and role = 'customer');

create policy "Profiles update own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid() and role = 'customer');

create policy "Profiles update admin"
on public.profiles
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Products public read active or admin"
on public.products
for select
using (active = true or public.is_admin(auth.uid()));

create policy "Products admin insert"
on public.products
for insert
with check (public.is_admin(auth.uid()));

create policy "Products admin update"
on public.products
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Products admin delete"
on public.products
for delete
using (public.is_admin(auth.uid()));

create policy "Orders read own or admin"
on public.orders
for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Orders insert own"
on public.orders
for insert
with check (user_id = auth.uid());

create policy "Orders admin update"
on public.orders
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Orders delete own"
on public.orders
for delete
using (user_id = auth.uid());

create policy "Orders admin delete"
on public.orders
for delete
using (public.is_admin(auth.uid()));

create policy "Order items read own or admin"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

create policy "Order items insert own"
on public.order_items
for insert
with check (
  exists (
    select 1
    from public.orders o
    where o.id = order_id
      and o.user_id = auth.uid()
  )
);

create policy "Order items admin update"
on public.order_items
for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Order items admin delete"
on public.order_items
for delete
using (public.is_admin(auth.uid()));

commit;
