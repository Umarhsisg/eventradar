# EventRadar

> Discover and post student events across Maharashtra — hackathons, fests, seminars, contests, workshops, and more.

**Live site:** [eventradar-zeta.vercel.app](https://eventradar-zeta.vercel.app)

---

## Features

- 🔍 **Event discovery** — browse, search, and filter events by type, district, and date
- 📝 **Event posting** — submit events with cover photo, invitation poster, and an interactive map pin
- 🗺️ **OpenStreetMap integration** — pick venue location with Nominatim search and drag-to-place pin (no paid APIs)
- 🔐 **Supabase Auth** — email signup with confirmation, college and district metadata
- 👮 **Admin panel** — approve or reject pending events, manage users
- 📍 **Maharashtra-focused** — all 35 districts + Online category, 14 event types
- 🎨 **Dark theme** — minimalistic blue/navy professional design with the Maharashtra outline as a centred decorative motif

## Tech stack

| Layer        | Tools |
|--------------|-------|
| Frontend     | React 19, Vite 8, React Router 7 |
| Styling      | Inline styles + Tailwind CSS v4 |
| Icons        | Lucide React |
| Map          | Leaflet + OpenStreetMap tiles, Nominatim geocoder |
| Backend      | Supabase (Postgres + Auth + Storage + Realtime) |
| Hosting      | Vercel (auto-deploy from GitHub `main`) |

## Project structure

```
src/
├── components/        # Reusable UI: EventCard, MapPicker, MaharashtraOutline, Navbar, etc.
├── hooks/             # useAuth, useEvents, useUsers — encapsulate Supabase logic
├── lib/               # supabase client, mockData (event types & districts)
├── pages/             # HomePage, EventDetailPage, PostEventPage, LoginPage, SignupPage, AdminPage
├── App.jsx            # Router and global auth state
└── main.jsx           # Entry point
supabase/
└── migrations/        # 001_initial_schema → 005_expand_event_types
```

## Local development

```bash
# Install dependencies
npm install

# Create .env.local with your Supabase credentials
cp .env.example .env.local   # then fill in the values

# Run dev server (http://localhost:5173)
npm run dev

# Production build
npm run build
npm run preview
```

### Environment variables

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Database setup

Run all migrations in `supabase/migrations/` against your Supabase project, in order:

1. `001_initial_schema.sql` — `profiles` and `events` tables, RLS, auth trigger
2. `002_storage_and_images.sql` — `event-assets` storage bucket + image columns
3. `003_location_columns.sql` — latitude, longitude, location address
4. `004_max_slots.sql` — max participant slots
5. `005_expand_event_types.sql` — full list of 14 event types

Also ensure the **`event-assets`** storage bucket exists and is public.

## Deployment

The project auto-deploys to Vercel from the `main` branch. To deploy manually:

```bash
vercel deploy --prod
```

Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) must be set in **Vercel → Project Settings → Environment Variables** for all three environments (Production, Preview, Development).

After the first deploy, update **Supabase → Authentication → URL Configuration**:
- Site URL: your production URL
- Redirect URLs: `https://your-domain.vercel.app/**` and any preview pattern

## Event types supported

Technical · Cultural · Sports · Management · Medical · Workshop · Academic · Social · Career · Hackathon · Fest · Seminar · Contest · Webinar

## Districts supported

All 35 Maharashtra districts plus an **Online** category for virtual events.
