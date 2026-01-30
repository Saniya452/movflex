'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getBackdropUrl, getImageUrl, getGenreNamesFromIds } from '@/lib/tmdb';
import type { Movie, TVShow, Genre } from '@/types';

interface HeroSectionProps {
  featured: Movie | TVShow;
  relatedItems?: (Movie | TVShow)[];
  isTVShow?: boolean;
  /** Genre list from TMDB (movie or TV) to map genre_ids → names when list API doesn't return genres */
  genreList?: Genre[];
}

export default function HeroSection({ featured, relatedItems = [], isTVShow = false, genreList = [] }: HeroSectionProps) {
  const title = isTVShow ? (featured as TVShow).name : (featured as Movie).title;
  const releaseDate = isTVShow 
    ? (featured as TVShow).first_air_date 
    : (featured as Movie).release_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const hasBackdrop = !!featured.backdrop_path;
  const backdropUrl = hasBackdrop ? getBackdropUrl(featured.backdrop_path) : getImageUrl(featured.poster_path, 'w780');
  const overview = featured.overview || 'No description available.';

  // Dynamic genres: from detail API (featured.genres) or map genre_ids using genreList
  const genres = featured.genres?.length
    ? featured.genres.map(g => g.name)
    : getGenreNamesFromIds(featured.genre_ids, genreList);

  return (
    <div className="relative w-full min-h-[50vh] h-[70vh] sm:min-h-[55vh] sm:h-[75vh] md:h-[78vh] lg:min-h-[600px] lg:h-[80vh] overflow-hidden">
      {/* Background Image: backdrop preferred, poster as fallback */}
      <div className="absolute inset-0 bg-zinc-900">
        <Image
          src={backdropUrl}
          alt={title || `${isTVShow ? 'TV Show' : 'Movie'} backdrop`}
          fill
          className={`object-cover object-center ${!hasBackdrop ? 'scale-110 blur-sm' : ''}`}
          priority
          sizes="100vw"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-6 pt-8 px-4 sm:pb-10 sm:px-6 md:pb-12 lg:pb-16 lg:px-8">
        <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-3xl">
          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black text-white mb-2 sm:mb-4 uppercase tracking-tight leading-tight break-words">
            {title}
          </h1>

          {/* Metadata */}
          <div className="mb-3 sm:mb-4 text-white/90 text-xs sm:text-sm md:text-base lg:text-lg flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold truncate max-w-[180px] sm:max-w-none lg:max-w-none lg:overflow-visible lg:whitespace-normal">{title}</span>
            {year && (
              <>
                <span className="text-white/70">/</span>
                <span>{year}</span>
              </>
            )}
            {genres.length > 0 && (
              <>
                <span className="text-white/70">/</span>
                <span className="line-clamp-1">{genres.join(' / ')}</span>
              </>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-base mb-4 sm:mb-6 max-w-2xl line-clamp-2 sm:line-clamp-3">
            {overview}
          </p>

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div className="mt-4 sm:mt-6 lg:mt-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              <div
                className="flex lg:grid gap-2 overflow-x-auto lg:overflow-visible scrollbar-hide pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none lg:grid-cols-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {relatedItems.slice(0, 8).map((item) => {
                  const itemTitle = 'name' in item ? item.name : item.title;
                  const itemHref = 'name' in item ? `/tv-shows/${item.id}` : `/movies/${item.id}`;
                  const isItemTVShow = 'name' in item;
                  return (
                    <Link
                      key={item.id}
                      href={itemHref}
                      className="flex-shrink-0 w-20 h-28 sm:w-24 sm:h-32 lg:w-auto lg:h-auto lg:aspect-[3/4] relative rounded overflow-hidden group cursor-pointer snap-start block"
                    >
                      <Image
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={itemTitle || `${isItemTVShow ? 'TV Show' : 'Movie'} poster`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 96px, 12.5vw"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
