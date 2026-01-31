'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { getSearchPage } from '@/actions/discover';
import { getImageUrl } from '@/lib/tmdb';
import type { Movie, TVShow } from '@/types';

const DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 6;

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

function SuggestionItem({ item, onSelect }: { item: Movie | TVShow; onSelect?: () => void }) {
  const isTV = item.media_type === 'tv';
  const title = isTV ? (item as TVShow).name : (item as Movie).title;
  const href = isTV ? `/tv-shows/${item.id}` : `/movies/${item.id}`;
  const posterUrl = getImageUrl(item.poster_path, 'w185');

  return (
    <Link
      href={href}
      onClick={onSelect}
      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left hover:bg-white/10 transition-colors"
    >
      <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-zinc-800">
        <Image
          src={posterUrl}
          alt=""
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-white text-sm font-medium truncate block">{title}</span>
        <span className="text-zinc-400 text-xs">{isTV ? 'TV Show' : 'Movie'}</span>
      </div>
    </Link>
  );
}

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
  const [suggestions, setSuggestions] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebouncedValue(searchQuery.trim(), DEBOUNCE_MS);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const { results } = await getSearchPage(query, 1, 'all');
      setSuggestions((results ?? []).slice(0, MAX_SUGGESTIONS));
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= MIN_QUERY_LENGTH) {
      fetchSuggestions(debouncedQuery);
      setDropdownOpen(true);
    } else {
      setSuggestions([]);
      setDropdownOpen(false);
    }
  }, [debouncedQuery, fetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const showDropdown = dropdownOpen && searchQuery.trim().length >= MIN_QUERY_LENGTH;

  const handleInputFocus = useCallback(() => {
    if (searchQuery.trim().length >= MIN_QUERY_LENGTH) setDropdownOpen(true);
  }, [searchQuery]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="flex items-stretch rounded-full bg-white/10 border border-white/20 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent">
        <div className="relative flex-1 min-w-0 flex items-center">
          <div className="absolute left-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="search"
            name={name}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleInputFocus}
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

      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-zinc-900 border border-zinc-700 shadow-xl overflow-hidden z-[100] max-h-[min(70vh,400px)] overflow-y-auto"
          role="listbox"
          aria-label="Search suggestions"
        >
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <ul className="py-2">
                {suggestions.map((item) => (
                  <li key={`${item.media_type}-${item.id}`}>
                    <SuggestionItem item={item} onSelect={() => setDropdownOpen(false)} />
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                onClick={() => setDropdownOpen(false)}
                className="block border-t border-zinc-700 px-4 py-3 text-center text-sm font-medium text-emerald-400 hover:bg-white/5 transition-colors"
              >
                See all results for &ldquo;{debouncedQuery}&rdquo;
              </Link>
            </>
          ) : (
            <div className="py-6 px-4 text-center text-zinc-400 text-sm">
              No movies or TV shows found. Try another search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
