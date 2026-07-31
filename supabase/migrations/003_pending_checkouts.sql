-- ============================================
-- TechVault PayPal Redirect Flow (Idempotent)
-- Run this in Supabase SQL Editor
-- Safe to re-run multiple times
-- ============================================

-- ============================================
-- 10. PENDING CHECKOUTS TABLE
-- Holds order data between PayPal redirect and return,
-- so an order is ONLY created after successful payment.
-- Service role only (no anon access).
-- ============================================
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
