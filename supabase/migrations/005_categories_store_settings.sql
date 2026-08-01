-- ============================================
-- TechVault: الفئات + إعدادات المتجر (آمن للتكرار)
-- شغّل هذا الملف في Supabase (Database ← SQL Editor)
-- ============================================

-- ---------- 1) CATEGORIES (فلاتر المتجر) ----------
create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  icon text not null default '🏷️',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

insert into public.categories (name, slug, icon, sort_order) values
  ('الكل', 'all', '🔥', 1),
  ('هواتف جديدة', 'new', '✨', 2),
  ('مستعملة / مجددة', 'used', '♻️', 3),
  ('رائدة', 'flagship', '👑', 4),
  ('اقتصادية', 'budget', '💰', 5),
  ('ألعاب', 'gaming', '🎮', 6),
  ('الأكثر مبيعاً', 'bestsellers', '🏆', 7)
on conflict (slug) do nothing;

alter table public.categories enable row level security;

drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone" on public.categories for select using (true);

drop policy if exists "Categories admin insert" on public.categories;
drop policy if exists "Categories admin update" on public.categories;
drop policy if exists "Categories admin delete" on public.categories;
create policy "Categories admin insert" on public.categories for insert with check (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Categories admin update" on public.categories for update using (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Categories admin delete" on public.categories for delete using (
  exists (select 1 from public.admins where id = auth.uid())
);

grant select on public.categories to anon, authenticated;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;

-- ---------- 2) STORE SETTINGS (معلومات المتجر) ----------
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  store_name text not null default 'TechVault',
  tagline text not null default '',
  description text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  whatsapp text not null default '',
  facebook text not null default '',
  instagram text not null default '',
  tiktok text not null default '',
  shipping_fee integer not null default 30,
  free_shipping_threshold integer not null default 300,
  support_hours text not null default 'من الاثنين إلى السبت: 9 صباحاً - 9 مساءً',
  updated_at timestamptz default now()
);

insert into public.store_settings (id) values (1) on conflict (id) do nothing;

alter table public.store_settings enable row level security;

drop policy if exists "Store settings are viewable by everyone" on public.store_settings;
create policy "Store settings are viewable by everyone" on public.store_settings for select using (true);

drop policy if exists "Store settings admin insert" on public.store_settings;
drop policy if exists "Store settings admin update" on public.store_settings;
drop policy if exists "Store settings admin delete" on public.store_settings;
create policy "Store settings admin insert" on public.store_settings for insert with check (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Store settings admin update" on public.store_settings for update using (
  exists (select 1 from public.admins where id = auth.uid())
);
create policy "Store settings admin delete" on public.store_settings for delete using (
  exists (select 1 from public.admins where id = auth.uid())
);

grant select on public.store_settings to anon, authenticated;
grant select, insert, update, delete on public.store_settings to authenticated;
grant all on public.store_settings to service_role;
