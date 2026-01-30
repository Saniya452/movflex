'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/tmdb';
import type { Movie, TVShow } from '@/types';

interface MovieCardProps {
  item: Movie | TVShow;
  isTVShow?: boolean;
}

export default function MovieCard({ item, isTVShow = false }: MovieCardProps) {
  const title = isTVShow ? (item as TVShow).name : (item as Movie).title;
  const releaseDate = isTVShow 
    ? (item as TVShow).first_air_date 
    : (item as Movie).release_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const rating = item.vote_average.toFixed(1);
  const posterUrl = getImageUrl(item.poster_path, 'w500');
  const href = isTVShow ? `/tv-shows/${item.id}` : `/movies/${item.id}`;

  // Determine rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-600';
    if (rating >= 6) return 'bg-yellow-500';
    return 'bg-gray-600';
  };

  return (
    <Link href={href} className="group relative flex-shrink-0 w-[200px] transition-transform duration-300 hover:scale-105">
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800">
        <Image
          src={posterUrl}
          alt={title || `${isTVShow ? 'TV Show' : 'Movie'} poster`}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-80"
          sizes="200px"
        />
        {/* Rating badge */}
        <div className={`absolute bottom-2 left-2 px-2 py-1 rounded ${getRatingColor(item.vote_average)} text-white text-xs font-semibold`}>
          {rating}
        </div>
        {/* Episode count for TV shows */}
        {isTVShow && (item as TVShow).number_of_episodes && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-green-600 text-white text-xs font-semibold">
            All {(item as TVShow).number_of_episodes}
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
      {year && (
        <p className="text-xs text-zinc-400 mt-1">{year}</p>
      )}
    </Link>
  );
}
