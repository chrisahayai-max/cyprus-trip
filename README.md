# Cyprus Trip Planner 🌊

Group itinerary app for the Cyprus boys trip — Aug 5–10, 2025.

## Features
- Day-by-day itinerary (Ayia Napa, Protaras, Limassol, Paphos)
- Friends suggest edits/additions — no login needed
- Real-time updates (everyone sees changes instantly)
- AI Review button — Claude reads all suggestions and updates the itinerary
- Shareable URL — paste it in the group chat and go

---

## Setup & Deploy

### 1. Supabase (database)

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Name it `cyprus-trip`, pick a region close to you, set a DB password
3. Once created, go to **SQL Editor** and paste the full contents of `supabase/schema.sql`
4. Click **Run** — this creates the tables and seeds all the itinerary data
5. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key → `ANTHROPIC_API_KEY`

### 3. Local development

```bash
cd cyprus-trip-planner

# Install deps
npm install

# Create env file
cp .env.local.example .env.local
# Fill in the three env vars from steps 1 & 2

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

**Option A — Vercel CLI (fastest)**
```bash
npm i -g vercel
vercel

# When prompted, say yes to defaults
# Then add env vars:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add ANTHROPIC_API_KEY

# Redeploy with the env vars
vercel --prod
```

**Option B — GitHub + Vercel dashboard**
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project → select your repo
3. In the **Environment Variables** section, add all three env vars
4. Click **Deploy**

Vercel gives you a public URL like `https://cyprus-trip-planner-xyz.vercel.app` — paste that in the group chat.

---

## How it works

### Suggesting edits
- Click **"Suggest edit"** on any activity card
- Or click **"Add idea"** / **"Suggest"** buttons for day-level suggestions
- Enter your name + suggestion — no account needed
- Everyone with the link sees it instantly (Supabase realtime)

### AI Review
- Click **✨ AI Review** in the header (shows count of pending suggestions)
- Claude (`claude-sonnet-4-20250514`) reads all suggestions + the current itinerary
- It decides what to apply and updates the DB directly
- Applied suggestions are marked, dismissed ones are noted
- The itinerary updates live for everyone

### Share link
- Click **Share** in the header → copies the URL to clipboard
- Anyone with the URL can view and suggest — no login, no signup

---

## Project structure

```
app/
  page.tsx              # Main UI (client component, full app)
  layout.tsx            # Root layout + metadata
  globals.css           # Tailwind + custom styles
  api/
    suggestions/route.ts  # GET/POST suggestions
    ai-review/route.ts    # Claude integration + DB updates
lib/
  supabase.ts           # Supabase client
  types.ts              # TypeScript types + constants
supabase/
  schema.sql            # DB tables + RLS policies + seed data
```

## Env vars

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
