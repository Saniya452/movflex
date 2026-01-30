'use client';

const SearchIcon = ({ className = 'text-zinc-400' }: { className?: string }) => (
  <svg className={`h-5 w-5 shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ClearIcon = ({ className = 'text-zinc-400' }: { className?: string }) => (
  <svg className={`h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  className = '',
  name = 'q',
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  className?: string;
  name?: string;
}) {
  return (
    <div className={`flex items-stretch rounded-full bg-white/10 border border-white/20 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent ${className}`}>
      <div className="relative flex-1 min-w-0 flex items-center">
        <div className="absolute left-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="search"
          name={name}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="w-full pl-10 pr-8 py-2.5 bg-transparent text-white placeholder-zinc-400 focus:outline-none text-sm min-w-0 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:[-webkit-appearance:none] [&::-webkit-search-cancel-button]:h-0 [&::-webkit-search-cancel-button]:w-0"
          aria-label="Search"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 flex items-center justify-center w-6 h-6 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      <button
        type="submit"
        className="flex items-center justify-center w-12 sm:w-14 shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="text-white" />
      </button>
    </div>
  );
}
