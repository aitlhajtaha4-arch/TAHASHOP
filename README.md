# TechVault - Smart Phone Store

Arabic RTL e-commerce platform built with Next.js 16, Supabase, and Tailwind CSS v4.

## Why GitHub Pages Does NOT Work

This project uses **server-side features** that require a Node.js runtime:

- **Server Actions** (`"use server"`) — 20+ server functions for CRUD, auth, and orders
- **`cookies()`** from `next/headers` — Supabase server-side auth sessions
- **`export const dynamic = "force-dynamic"`** — server-side rendering at request time

GitHub Pages is a **static file host** — it cannot run Node.js, execute server actions, or handle authentication. There is no configuration that makes this work. This is an architectural limitation, not a bug.

## Deploy to Vercel (Free — 1 Minute Setup)

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click **"Add New Project"**
4. Select your repository
5. Vercel auto-detects Next.js — click **Deploy**
6. Add environment variables when prompted:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://scmuvluhezcmfkvywnwo.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
7. Done. Your site is live.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

## Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://scmuvluhezcmfkvywnwo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

## Local Development

```bash
npm install
cp .env.example .env.local  # Add your Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 16 (App Router + Server Actions)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase (Auth + Database)
- Arabic RTL with Cairo font
