-- ============================================
-- TechVault Supabase Schema (Idempotent)
-- Run this in Supabase SQL Editor
-- Safe to re-run multiple times
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. BRANDS TABLE
-- ============================================
create table if not exists public.brands (
  id bigint generated always as identity primary key,
  name text not null unique,
  logo text not null default '',
  created_at timestamptz default now()
);

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  brand text not null,
  price integer not null,
  original_price integer,
  image text not null default '',
  rating numeric(3,1) default 4.0,
  review_count integer default 0,
  badge text,
  storage text not null default '128 GB',
  ram text not null default '8 GB',
  camera text not null default '',
  battery text not null default '',
  screen_size text not null default '',
  processor text not null default '',
  colors text[] default '{}',
  category text not null default 'flagship',
  condition text not null default 'جديد' check (condition in ('جديد', 'مستعمل', 'مجدد')),
  free_shipping boolean default true,
  available boolean default true,
  monthly_payment integer,
  description text not null default '',
  created_at timestamptz default now()
);

-- ============================================
-- 3. FLASH DEALS TABLE
-- ============================================
create table if not exists public.flash_deals (
  id bigint generated always as identity primary key,
  name text not null,
  brand text not null,
  price integer not null,
  original_price integer not null,
  image text not null default '',
  discount integer not null default 0,
  ends_at timestamptz not null,
  start_date timestamptz default now(),
  badge text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- 4. REVIEWS TABLE
-- ============================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id bigint not null references public.products(id) on delete cascade,
  name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  content text not null default '',
  date date default current_date,
  created_at timestamptz default now()
);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  address text not null,
  postal_code text not null,
  payment_method text not null default 'cod',
  delivery_option text not null default 'standard',
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total integer not null,
  discount integer default 0,
  shipping integer default 0,
  vat integer default 0,
  items jsonb not null default '[]',
  created_at timestamptz default now()
);

-- ============================================
-- 6. ADMINS TABLE (uses Supabase Auth)
-- ============================================
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default 'Admin',
  created_at timestamptz default now()
);

-- ============================================
-- 7. NOTIFICATIONS TABLE
-- ============================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'order', 'review', 'alert')),
  read boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- 8. ACCESSORIES TABLE
-- ============================================
create table if not exists public.accessories (
  id bigint generated always as identity primary key,
  name text not null,
  brand text not null,
  category text not null default 'other',
  image text not null default '',
  price integer not null,
  original_price integer,
  stock integer not null default 0,
  description text not null default '',
  featured boolean default false,
  available boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_products_brand on public.products(brand);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_condition on public.products(condition);
create index if not exists idx_flash_deals_sort on public.flash_deals(sort_order);
create index if not exists idx_flash_deals_active on public.flash_deals(is_active);
create index if not exists idx_reviews_product_id on public.reviews(product_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at);
create index if not exists idx_notifications_read on public.notifications(read);
create index if not exists idx_accessories_category on public.accessories(category);
create index if not exists idx_accessories_featured on public.accessories(featured);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Brands: public read, admin write
alter table public.brands enable row level security;
drop policy if exists "Brands are viewable by everyone" on public.brands;
create policy "Brands are viewable by everyone" on public.brands for select using (true);
drop policy if exists "Brands manageable by admins" on public.brands;
drop policy if exists "Brands admin insert" on public.brands;
drop policy if exists "Brands admin update" on public.brands;
drop policy if exists "Brands admin delete" on public.brands;
create policy "Brands admin insert" on public.brands for insert with check (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Brands admin update" on public.brands for update using (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Brands admin delete" on public.brands for delete using (
  exists (select 1 from public.admins where id = auth.uid())
);

-- Products: public read, admin write
alter table public.products enable row level security;
drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone" on public.products for select using (true);
drop policy if exists "Products manageable by admins" on public.products;
drop policy if exists "Products admin insert" on public.products;
drop policy if exists "Products admin update" on public.products;
drop policy if exists "Products admin delete" on public.products;
create policy "Products admin insert" on public.products for insert with check (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Products admin update" on public.products for update using (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Products admin delete" on public.products for delete using (
  exists (select 1 from public.admins where id = auth.uid())
);

-- Flash Deals: public read, admin write
alter table public.flash_deals enable row level security;
drop policy if exists "Flash deals are viewable by everyone" on public.flash_deals;
create policy "Flash deals are viewable by everyone" on public.flash_deals for select using (true);
drop policy if exists "Flash deals manageable by admins" on public.flash_deals;
drop policy if exists "Flash deals admin insert" on public.flash_deals;
drop policy if exists "Flash deals admin update" on public.flash_deals;
drop policy if exists "Flash deals admin delete" on public.flash_deals;
create policy "Flash deals admin insert" on public.flash_deals for insert with check (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Flash deals admin update" on public.flash_deals for update using (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Flash deals admin delete" on public.flash_deals for delete using (
  exists (select 1 from public.admins where id = auth.uid())
);

-- Reviews: public read, anyone can insert, anyone can delete
alter table public.reviews enable row level security;
drop policy if exists "Reviews are viewable by everyone" on public.reviews;
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
drop policy if exists "Anyone can create reviews" on public.reviews;
create policy "Anyone can create reviews" on public.reviews for insert with check (true);
drop policy if exists "Anyone can delete their own reviews" on public.reviews;
create policy "Anyone can delete their own reviews" on public.reviews for delete using (true);

-- Orders: admin read/update/delete, public can insert
alter table public.orders enable row level security;
drop policy if exists "Orders manageable by admins" on public.orders;
drop policy if exists "Orders admin read" on public.orders;
drop policy if exists "Orders admin update" on public.orders;
drop policy if exists "Orders admin delete" on public.orders;
create policy "Orders admin read" on public.orders for select using (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Orders admin update" on public.orders for update using (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Orders admin delete" on public.orders for delete using (
  exists (select 1 from public.admins where id = auth.uid())
);
drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders" on public.orders for insert with check (true);

-- Admins: only self-read
alter table public.admins enable row level security;
drop policy if exists "Admins can read own profile" on public.admins;
create policy "Admins can read own profile" on public.admins for select using (id = auth.uid());

-- Notifications: admin only
alter table public.notifications enable row level security;
drop policy if exists "Notifications manageable by admins" on public.notifications;
create policy "Notifications manageable by admins" on public.notifications for all using (
  exists (select 1 from public.admins where id = auth.uid())
);

-- Accessories: public read, admin write
alter table public.accessories enable row level security;
drop policy if exists "Accessories are viewable by everyone" on public.accessories;
create policy "Accessories are viewable by everyone" on public.accessories for select using (true);
drop policy if exists "Accessories admin insert" on public.accessories;
drop policy if exists "Accessories admin update" on public.accessories;
drop policy if exists "Accessories admin delete" on public.accessories;
create policy "Accessories admin insert" on public.accessories for insert with check (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Accessories admin update" on public.accessories for update using (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Accessories admin delete" on public.accessories for delete using (
  exists (select 1 from public.admins where id = auth.uid())
);

-- ============================================
-- TABLE GRANTS
-- ============================================
grant select on public.brands to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.flash_deals to anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant select on public.orders to anon, authenticated;
grant insert, update, delete on public.orders to anon, authenticated;
grant insert, update, delete on public.reviews to anon, authenticated;
grant select, insert, update, delete on public.admins to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.brands to authenticated;
grant select, insert, update, delete on public.flash_deals to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select on public.accessories to anon, authenticated;
grant select, insert, update, delete on public.accessories to authenticated;
grant all on public.admins to service_role;

-- ============================================
-- STORAGE BUCKET
-- ============================================
insert into storage.buckets (id, name, public) values ('products', 'products', true)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "Product images are publicly accessible" on storage.objects;
create policy "Product images are publicly accessible" on storage.objects
  for select using (bucket_id = 'products');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images" on storage.objects
  for insert with check (bucket_id = 'products' and exists (
    select 1 from public.admins where id = auth.uid()
  ));

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images" on storage.objects
  for delete using (bucket_id = 'products' and exists (
    select 1 from public.admins where id = auth.uid()
  ));
