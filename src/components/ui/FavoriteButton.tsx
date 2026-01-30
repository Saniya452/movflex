'use client';

import { useCallback, useEffect, useState } from 'react';
import { getFavorites, toggleFavorite } from '@/lib/favorites';

interface FavoriteButtonProps {
  movieId: number;
  mediaType?: 'movie' | 'tv';
  className?: string;
}

export default function FavoriteButton({ movieId, mediaType = 'movie', className = '' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const list = getFavorites();
    setIsFavorite(list.some((f) => f.id === movieId && f.media_type === mediaType));
  }, [mounted, movieId, mediaType]);

  const handleClick = useCallback(() => {
    const next = toggleFavorite(movieId, mediaType);
    setIsFavorite(next);
  }, [movieId, mediaType]);

  if (!mounted) {
    return (
      <div className={`h-10 w-36 rounded-lg bg-zinc-800 animate-pulse ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold ${isFavorite ? 'bg-emerald-600/90 text-white hover:bg-emerald-600' : 'border-2 border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400'} ${className}`}
      aria-pressed={isFavorite}
    >
      {isFavorite ? (
        <>
          <span aria-hidden>♥</span>
          Remove from favorites
        </>
      ) : (
        <>
          <span aria-hidden>♡</span>
          Add to favorites
        </>
      )}
    </button>
  );
}
