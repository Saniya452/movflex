'use client';

import { useState, useCallback } from 'react';
import MovieCard from '@/components/ui/MovieCard';
import Spinner from '@/components/ui/Spinner';
import { getDiscoverMoviesPage, getDiscoverTVPage, getSearchPage } from '@/actions/discover';
import type { Movie, TVShow } from '@/types';

type SearchType = 'all' | 'movie' | 'tv';

type GridWithLoadMoreProps =
  | {
      mode: 'movies';
      initialItems: Movie[];
      initialPage?: number;
      totalPages: number;
      genre: string;
      year: string;
    }
  | {
      mode: 'tv';
      initialItems: TVShow[];
      initialPage?: number;
      totalPages: number;
      genre: string;
      year: string;
    }
  | {
      mode: 'search';
      initialItems: (Movie | TVShow)[];
      totalPages: number;
      query: string;
      type: SearchType;
    };

function getKey(item: Movie | TVShow, mode: string, searchType?: SearchType): string {
  if (mode === 'search' && searchType === 'all')
    return `${(item as Movie & { media_type?: string }).media_type}-${item.id}`;
  return String(item.id);
}

function getIsTVShow(item: Movie | TVShow, mode: string, searchType?: SearchType): boolean {
  if (mode === 'tv') return true;
  if (mode === 'search' && searchType === 'tv') return true;
  return (item as Movie & { media_type?: string }).media_type === 'tv';
}

export default function GridWithLoadMore(props: GridWithLoadMoreProps) {
  const { mode, initialItems, totalPages: initialTotalPages } = props;
  const initialPage = 'initialPage' in props ? props.initialPage ?? 1 : 1;
  const [items, setItems] = useState<(Movie | TVShow)[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [totalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const hasMore = page < totalPages;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      if (mode === 'movies') {
        const { results } = await getDiscoverMoviesPage(page + 1, props.genre || undefined, props.year || undefined);
        setItems((prev) => [...prev, ...results]);
      } else if (mode === 'tv') {
        const { results } = await getDiscoverTVPage(page + 1, props.genre || undefined, props.year || undefined);
        setItems((prev) => [...prev, ...results]);
      } else {
        const { results } = await getSearchPage(props.query, page + 1, props.type);
        setItems((prev) => [...prev, ...results]);
      }
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }, [mode, page, loading, hasMore, ...(mode === 'search' ? [props.query, props.type] : [props.genre, props.year])]);

  const searchType = mode === 'search' ? props.type : undefined;

  return (
    <>
      {/* Mobile-first grid: 2 cols mobile → 3 tablet → 4 → 5 → 6 desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {items.map((item) => (
          <MovieCard
            key={getKey(item, mode, searchType)}
            item={item}
            isTVShow={getIsTVShow(item, mode, searchType)}
            variant="grid"
          />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium transition-colors min-w-[120px]"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="border-t-white" />
                <span>Loading…</span>
              </>
            ) : (
              'More'
            )}
          </button>
        </div>
      )}
    </>
  );
}
