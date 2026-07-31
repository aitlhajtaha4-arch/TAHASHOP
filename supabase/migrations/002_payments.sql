-- ============================================
-- TechVault Payment Settings (Idempotent)
-- Run this in Supabase SQL Editor
-- Safe to re-run multiple times
-- ============================================

-- ============================================
-- 9. PAYMENT SETTINGS TABLE (single row, id=1)
-- PayPal credentials are admin-only via RLS.
-- ============================================
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

-- ============================================
-- ORDERS: payment columns
-- ============================================
alter table public.orders add column if not exists payment_status text not null default 'pending'
  check (payment_status in ('pending', 'paid', 'failed', 'refunded'));
alter table public.orders add column if not exists transaction_id text;
alter table public.orders add column if not exists paid_at timestamptz;
alter table public.orders add column if not exists payer_email text;
alter table public.orders add column if not exists payer_id text;

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_transaction_id on public.orders(transaction_id);

-- ============================================
-- ROW LEVEL SECURITY (admin-only)
-- ============================================
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

-- ============================================
-- GRANTS (column-level: secret NEVER exposed to anon)
-- ============================================
grant select, insert, update, delete on public.payment_settings to service_role;
grant select (paypal_client_id, paypal_mode, paypal_currency, paypal_rate, paypal_enabled, cod_enabled, updated_at)
  on public.payment_settings to anon, authenticated;
grant select (paypal_client_id, paypal_mode, paypal_currency, paypal_rate, paypal_enabled, cod_enabled, updated_at)
  on public.payment_settings to authenticated;
