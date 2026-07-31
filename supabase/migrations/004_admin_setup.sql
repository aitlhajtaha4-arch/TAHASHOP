-- ============================================
-- TechVault: إعداد كامل للأدمن والدفع (آمن للتكرار)
-- شغّل هذا الملف كاملاً في Supabase (Database ← SQL Editor)
-- ينشئ: جدول accessories، إعدادات الدفع، جدول الطلبات المعلقة،
-- وحساب المشرف (تظهر كلمة المرور في تبويب Messages).
-- ============================================

-- ---------- 1) ACCESSORIES (إن لم يكن موجوداً) ----------
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
grant select on public.accessories to anon, authenticated;
grant select, insert, update, delete on public.accessories to authenticated;
grant all on public.accessories to service_role;

-- ---------- 2) PAYMENT SETTINGS (الدفع) ----------
create table if not exists public.payment_settings (
  id integer primary key default 1 check (id = 1),
  paypal_client_id text not null default '',
  paypal_client_secret text not null default '',
  paypal_mode text not null default 'sandbox' check (paypal_mode in ('sandbox', 'live')),
  paypal_currency text not null default 'USD',
  paypal_rate numeric(10,2) not null default 10.00,
  paypal_enabled boolean not null default true,
  cod_enabled boolean not null default true,
  updated_at timestamptz default now()
);

insert into public.payment_settings (id) values (1) on conflict (id) do nothing;

alter table public.orders add column if not exists payment_status text not null default 'pending'
  check (payment_status in ('pending', 'paid', 'failed', 'refunded'));
alter table public.orders add column if not exists transaction_id text;
alter table public.orders add column if not exists paid_at timestamptz;
alter table public.orders add column if not exists payer_email text;
alter table public.orders add column if not exists payer_id text;

create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_transaction_id on public.orders(transaction_id);

alter table public.payment_settings enable row level security;

drop policy if exists "Payment settings admin select" on public.payment_settings;
create policy "Payment settings admin select" on public.payment_settings for select using (
  exists (select 1 from public.admins where id = auth.uid())
);
drop policy if exists "Payment settings admin insert" on public.payment_settings;
create policy "Payment settings admin insert" on public.payment_settings for insert with check (
  exists (select 1 from public.admins where id = auth.uid())
);
drop policy if exists "Payment settings admin update" on public.payment_settings;
create policy "Payment settings admin update" on public.payment_settings for update using (
  exists (select 1 from public.admins where id = auth.uid())
);
drop policy if exists "Payment settings admin delete" on public.payment_settings;
create policy "Payment settings admin delete" on public.payment_settings for delete using (
  exists (select 1 from public.admins where id = auth.uid())
);

grant select, insert, update, delete on public.payment_settings to service_role;
grant select (paypal_client_id, paypal_mode, paypal_currency, paypal_rate, paypal_enabled, cod_enabled, updated_at)
  on public.payment_settings to anon, authenticated;

-- ---------- 3) PENDING CHECKOUTS (مسار PayPal) ----------
create table if not exists public.pending_checkouts (
  id uuid primary key default uuid_generate_v4(),
  paypal_order_id text not null unique,
  data jsonb not null,
  created_at timestamptz default now()
);

create index if not exists idx_pending_checkouts_created_at on public.pending_checkouts(created_at);

alter table public.pending_checkouts enable row level security;

drop policy if exists "Pending checkouts admin select" on public.pending_checkouts;
create policy "Pending checkouts admin select" on public.pending_checkouts for select using (
  exists (select 1 from public.admins where id = auth.uid())
);
drop policy if exists "Pending checkouts admin insert" on public.pending_checkouts;
create policy "Pending checkouts admin insert" on public.pending_checkouts for insert with check (
  exists (select 1 from public.admins where id = auth.uid())
);
drop policy if exists "Pending checkouts admin delete" on public.pending_checkouts;
create policy "Pending checkouts admin delete" on public.pending_checkouts for delete using (
  exists (select 1 from public.admins where id = auth.uid())
);

grant select, insert, update, delete on public.pending_checkouts to service_role;

-- ---------- 4) ADMIN ACCOUNT ----------
-- ينشئ حساب مشرف (admin@techvault.ma) بكلمة مرور عشوائية
-- تظهر في تبويب Messages. لا يُنشأ شيء إذا كان هناك مشرف مسجل.
do $$
declare
  admin_email text := 'admin@techvault.ma';
  existing_admin int;
  existing_user int;
  admin_id uuid;
  generated_password text;
begin
  select count(*) into existing_admin from public.admins;
  if existing_admin = 0 then
    select count(*) into existing_user from auth.users where email = admin_email;
    if existing_user = 0 then
      generated_password := 'tv-' || substr(md5(random()::text), 1, 18);
      admin_id := auth.admin_create_user(
        email := admin_email,
        password := generated_password,
        email_confirm := true
      );
      raise notice 'ADMIN_EMAIL = %', admin_email;
      raise notice 'ADMIN_PASSWORD = %', generated_password;
    else
      select id into admin_id from auth.users where email = admin_email;
      raise notice 'وجد حساب admin@techvault.ma — تمت إضافته كمشرف فقط.';
    end if;
    insert into public.admins (id, email, name)
    values (admin_id, admin_email, 'Admin')
    on conflict (id) do nothing;
  else
    raise notice 'يوجد مشرف مسجل بالفعل — تم تخطي إنشاء حساب المشرف.';
  end if;
end $$;
