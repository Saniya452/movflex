'use client';

const SearchIcon = () => (
  <svg className="h-5 w-5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  className = '',
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search movies, TV shows..."
        className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm min-w-0"
      />
    </div>
  );
}
