'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getWatchlist, toggleWatchlist } from '@/lib/watchlist';

interface WatchlistButtonProps {
  movieId: number;
  mediaType?: 'movie' | 'tv';
  title?: string;
  posterPath?: string | null;
  className?: string;
  /** When true, redirect to /watchlist after adding (default: false) */
  redirectOnAdd?: boolean;
}

export default function WatchlistButton({
  movieId,
  mediaType = 'movie',
  title,
  posterPath,
  className = '',
  redirectOnAdd = false,
}: WatchlistButtonProps) {
  const router = useRouter();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const list = getWatchlist();
    setInWatchlist(list.some((w) => w.id === movieId && w.media_type === mediaType));
  }, [mounted, movieId, mediaType]);

  const handleClick = useCallback(() => {
    const added = toggleWatchlist(movieId, mediaType, { title, poster_path: posterPath });
    setInWatchlist(added);
    if (added && redirectOnAdd) {
      router.push('/watchlist');
    }
  }, [movieId, mediaType, title, posterPath, redirectOnAdd, router]);

  if (!mounted) {
    return (
      <div className={`h-10 w-36 rounded-lg bg-zinc-800 animate-pulse ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold ${inWatchlist ? 'bg-emerald-600/90 text-white hover:bg-emerald-600' : 'border-2 border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400'} ${className}`}
      aria-pressed={inWatchlist}
    >
      {inWatchlist ? (
        <>
          <BookmarkIcon filled />
          Remove from watchlist
        </>
      ) : (
        <>
          <BookmarkIcon filled={false} />
          Add to watchlist
        </>
      )}
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <span aria-hidden className="shrink-0">
      {filled ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
        </svg>
      )}
    </span>
  );
}
