# Movflex

Movie & TV discovery app with **Next.js** (App Router) and **TMDB API**. Browse, search (live suggestions), and save items to a **watchlist** (localStorage).

---

## Features

| Feature               | Description                                                                      |
| --------------------- | -------------------------------------------------------------------------------- |
| **Home**              | Hero + trending content                                                          |
| **Movies / TV Shows** | Browse with genre & year filters, load more                                      |
| **Search**            | Navbar search, debounced suggestions (2+ chars), full results at `/search?q=...` |
| **Watchlist**         | Add/remove from detail pages; stored in **localStorage** (no backend)            |
| **Detail pages**      | Poster, rating, overview, cast, watchlist button                                 |
| **Responsive**        | Mobile-first, Tailwind CSS                                                       |

---

## Architecture (text)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js App                               │
├─────────────────────────────────────────────────────────────────┤
│  App Router (pages)     │  Server Actions (discover.ts)          │
│  /, /movies, /tv-shows  │  → getDiscoverMoviesPage, getSearchPage │
│  /search, /watchlist    │  → calls lib/tmdb.ts (TMDB API)         │
├─────────────────────────────────────────────────────────────────┤
│  Client components:                                               │
│  • SearchBar → useDebouncedValue → getSearchPage (server) → TMDB  │
│  • WatchlistButton / Watchlist page → lib/watchlist.ts → localStorage │
│  • GridWithLoadMore → server actions (paginated discover/search)  │
└─────────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
   localStorage                         TMDB API (axios)
   key: movflex-watchlist               env: NEXT_PUBLIC_TMDB_API_KEY
```

---

## How the watchlist is stored and managed

- **Storage:** Browser **localStorage**, key `movflex-watchlist`.
- **Shape:** JSON array of `{ id, media_type: 'movie'|'tv', title?, poster_path? }`.
- **API** (`src/lib/watchlist.ts`): `getWatchlist`, `isInWatchlist`, `addToWatchlist`, `removeFromWatchlist`, `toggleWatchlist`.
- **Duplicates:** Prevented by `(id, media_type)`; add is no-op if already present.
- **UI:** `WatchlistButton` (detail pages) and `/watchlist` page read only **after client mount** (see trade-offs) and then sync with localStorage on each change.

---

## One challenging part: Server-side API

**Server-side API (TMDB):** We didn’t do complex handling server actions call TMDB directly, API key from env. That part wasn’t challenging, just a bit confusing.

---

## Edge cases handled

| Area             | Handling                                                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Watchlist**    | `getWatchlist()`: `typeof window === 'undefined'` → `[]`; `try/catch` around `JSON.parse`; if parsed value isn’t an array, return `[]`.                              |
| **Duplicates**   | `addToWatchlist` checks `(id, media_type)` and returns without adding if already in list.                                                                            |
| **Search**       | Empty or whitespace-only query: no API call. Min 2 characters before search. Multi-search results filtered to `media_type === 'movie' \|\| 'tv'` (persons excluded). |
| **Load more**    | `GridWithLoadMore`: `loading` and `hasMore` guards so we don’t double-fetch or request past last page.                                                               |
| **Watchlist UI** | Missing `title` / `poster_path`: fallback to `Movie #id` / `TV Show #id` and a placeholder image.                                                                    |

---

## Rough time breakdown per feature (estimate)

| Feature                               | Time        |
| ------------------------------------- | ----------- |
| Project setup and structure           | 30 min–1 hr |
| Routing and UI                        | 1–2 hr      |
| Live Search                           | 20 min      |
| Watchlist & LocalStorage              | 10–20 min   |
| Deployment (Vercel)                   | 10–20 min   |
| Edge cases, UI fixing, responsiveness | ~2 hr       |

---

## Project structure

```
src/
├── app/                      # Routes (App Router)
│   ├── layout.tsx            # Root layout (navbar, footer)
│   ├── page.tsx              # Home
│   ├── loading.tsx           # Global loading UI
│   ├── movies/
│   │   ├── page.tsx          # /movies (list + filters)
│   │   ├── [id]/page.tsx     # /movies/123 (detail)
│   │   └── loading.tsx
│   ├── tv-shows/
│   │   ├── page.tsx          # /tv-shows
│   │   ├── [id]/page.tsx     # /tv-shows/456
│   │   └── loading.tsx
│   ├── search/
│   │   ├── page.tsx          # /search?q=...
│   │   └── loading.tsx
│   └── watchlist/
│       ├── page.tsx          # /watchlist (localStorage)
│       └── loading.tsx
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx        # Logo, links, SearchBar
│   └── ui/
│       ├── SearchBar.tsx     # Input + debounced suggestions
│       ├── WatchlistButton.tsx
│       ├── MovieCard.tsx
│       ├── GridWithLoadMore.tsx
│       ├── DiscoverFilters.tsx
│       ├── HeroSection.tsx
│       ├── ContentCarousel.tsx
│       ├── LoadingScreen.tsx
│       └── ...
│
├── hooks/
│   ├── useDebouncedValue.ts  # For live search
│   └── useLockBodyScroll.ts
│
├── actions/
│   └── discover.ts           # Server actions (discover, search)
│
├── lib/
│   ├── tmdb.ts               # TMDB API client
│   ├── watchlist.ts          # localStorage watchlist (get/add/remove/toggle)
│   └── utils.ts
│
└── types/
    └── index.ts              # Movie, TVShow, etc.
```

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4
- **Data:** TMDB API; watchlist in **localStorage** via `src/lib/watchlist.ts`
- **Language:** TypeScript

---

## Quick start

1. **Prereqs:** Node 18+, [TMDB API key](https://www.themoviedb.org/settings/api).
2. **Clone & install:** `git clone <repo> && cd movflex && npm install`
3. **Env:** `cp env.example .env.local` and set `NEXT_PUBLIC_TMDB_API_KEY=...`
4. **Run:** `npm run dev` → [http://localhost:3000](http://localhost:3000)

**Scripts:** `npm run build` / `npm start` for production.

**Deploy (e.g. Vercel):** Add `NEXT_PUBLIC_TMDB_API_KEY` in project env and deploy.
