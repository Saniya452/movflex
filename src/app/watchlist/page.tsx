'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getWatchlist, removeFromWatchlist } from '@/lib/watchlist';
import { getImageUrl } from '@/lib/tmdb';
import type { WatchlistItem } from '@/lib/watchlist';

function WatchlistCard({
  item,
  onRemove,
}: {
  item: WatchlistItem;
  onRemove: () => void;
}) {
  const title = item.title ?? (item.media_type === 'tv' ? `TV Show #${item.id}` : `Movie #${item.id}`);
  const posterUrl = item.poster_path ? getImageUrl(item.poster_path, 'w500') : '/images/logo-dark-transparent.png';
  const href = item.media_type === 'tv' ? `/tv-shows/${item.id}` : `/movies/${item.id}`;

  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-800/80 ring-1 ring-zinc-700/50 hover:ring-emerald-500/40 transition-all">
      <Link href={href} className="block aspect-[2/3] relative">
        <Image
          src={posterUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      </Link>
      <div className="p-3 sm:p-4">
        <Link href={href}>
          <h3 className="font-semibold text-white truncate hover:text-emerald-400 transition-colors" title={title}>
            {title}
          </h3>
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getWatchlist());
  }, []);

  const handleRemove = useCallback((id: number, mediaType: 'movie' | 'tv') => {
    removeFromWatchlist(id, mediaType);
    setItems(getWatchlist());
  }, []);

  const movies = items.filter((i) => i.media_type === 'movie');
  const tvShows = items.filter((i) => i.media_type === 'tv');
  const hasAny = items.length > 0;

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-sans">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-500" />
          <p className="mt-4 text-lg text-zinc-400">Loading watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Watchlist</h1>
        <p className="text-zinc-400 mb-8">Your saved movies and TV shows.</p>

        {!hasAny ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
            <p className="text-xl font-medium text-zinc-400 mb-2">No watchlist items yet</p>
            <p className="text-zinc-500 text-sm max-w-sm">
              Save movies and shows from their pages, they’ll show up here so you can pick something to watch anytime.
            </p>
            <Link
              href="/movies"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border-2 border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              Browse movies
            </Link>
          </div>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Movies</h2>
              {movies.length === 0 ? (
                <p className="text-zinc-500 text-sm py-4">No movies in your watchlist yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {movies.map((item) => (
                    <WatchlistCard
                      key={`movie-${item.id}`}
                      item={item}
                      onRemove={() => handleRemove(item.id, item.media_type)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">TV Shows</h2>
              {tvShows.length === 0 ? (
                <p className="text-zinc-500 text-sm py-4">No TV shows in your watchlist yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {tvShows.map((item) => (
                    <WatchlistCard
                      key={`tv-${item.id}`}
                      item={item}
                      onRemove={() => handleRemove(item.id, item.media_type)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
