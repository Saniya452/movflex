# Movflex

## Project Structure

src/
├── app/ # Pages & Routes
│ ├── layout.tsx # Main layout (navbar, footer)
│ ├── page.tsx # Home page (/)
│ ├── movies/ # Movies pages
│ │ ├── page.tsx # /movies
│ │ └── loading.tsx # Loading state for movies
│ └── / # Watchlist Screen page
│ └── page.tsx # /watchlist
│
├── components/ # All React components
│ ├── layout/ # Layout components
│ │ └── Navbar.tsx # Navigation bar
│ └── ui/ # Reusable UI components
│ └── Button.tsx # Button component
│
├── lib/ # Utilities & helpers
│ ├── tmdb.ts # TMDB API calls
│ └── utils.ts # Helper functions
│
└── types/ # TypeScript types
└── index.ts # All type definitions
