# Movflex

A movie & TV show discovery app built with Next.js (App Router) and the TMDB API. Includes live search with debounced suggestions in the navbar.

---

## Project Structure

```
src/
├── app/                    # Pages & routes
│   ├── layout.tsx          # Main layout (navbar, footer)
│   ├── page.tsx            # Home (/)
│   ├── movies/
│   │   ├── page.tsx        # /movies
│   │   └── loading.tsx
│   ├── tv-shows/
│   │   ├── page.tsx        # /tv-shows
│   │   └── loading.tsx
│   ├── search/
│   │   ├── page.tsx        # /search?q=... (full results)
│   │   └── loading.tsx
│   └── watchlist/
│       └── page.tsx        # /watchlist
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── ContentCarousel.tsx
│       ├── HeroSection.tsx
│       ├── MovieCard.tsx
│       ├── SearchBar.tsx   # Input + suggestions dropdown
│       ├── Spinner.tsx
│       └── GridWithLoadMore.tsx
│
├── hooks/
│   ├── useDebouncedValue.ts  # Debounce for live search
│   └── useLockBodyScroll.ts
│
├── actions/
│   └── discover.ts         # Server actions (discover + search)
│
├── lib/
│   ├── tmdb.ts             # TMDB API (movies, TV, search)
│   └── utils.ts
│
└── types/
    └── index.ts            # Movie, TV show & API types
```

## Frontend: Next.js (App Router)

This project uses **Next.js** with the **App Router** (not the legacy Pages Router).

**Why App Router:**

- **React Server Components** — Faster by default; less client JS, better initial load.
- **Layouts, nested routes, loading/error states** — Easy shared layouts, route-level `loading.tsx` and error handling.
- **Better SEO & performance** — Content rendered on the server; important for movie titles and discoverability.
- **Cleaner folder structure** — Routes under `src/app/` with clear `page.tsx`, `layout.tsx`, `loading.tsx` per route.
- **Movies fetched on the server** — No `useEffect`, no client-side loading delay; page loads faster with data ready on first paint.

The project does **not** use the Pages Router (`src/pages/`); all routing is under `src/app/`.

---

## Live Search

Live search runs in the navbar: as the user types, suggestions appear in a dropdown without a full page load.

**What it does:**

- **Debouncing:** Input is debounced (350 ms) so the API is not called on every keystroke.
- **Min length:** Search runs only when the query has at least 2 characters.
- **Suggestions:** Up to 6 results (movies + TV) with poster, title, and type (Movie/TV Show).
- **“See all results”:** Link to full search page `/search?q=...`.
- **Form submit:** Enter or search button still submits to `/search?q=...` for full results.

**Time to implement (live search feature only):** ~10–20 minutes (one session: hook, SearchBar with dropdown, merge into one component, close on click).

---
