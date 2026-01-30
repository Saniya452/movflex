# Movflex

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
│       └── MovieCard.tsx
│
├── lib/
│   ├── tmdb.ts             # TMDB API (movies & TV shows)
│   └── utils.ts
│
└── types/
    └── index.ts            # Movie, TV show & API types
```

---

## What’s done

- **Pages:** Movies (`/movies`), TV shows (`/tv-shows`), Watchlist (`/watchlist`) with loading states
- **UI:** Navbar, Button, ContentCarousel, MovieCard, HeroSection
- **API:** TMDB integration in `lib/tmdb.ts` for movies & TV shows
- **Types:** TypeScript types for movies, TV shows, and API responses in `types/index.ts`

**Rough time:** 30 min to 1 hr (pages + components + TMDB + types)

---
