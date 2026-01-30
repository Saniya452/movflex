'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getBackdropUrl, getImageUrl } from '@/lib/tmdb';
import type { Movie, TVShow } from '@/types';

interface HeroSectionProps {
  featured: Movie | TVShow;
  relatedItems?: (Movie | TVShow)[];
  isTVShow?: boolean;
}

export default function HeroSection({ featured, relatedItems = [], isTVShow = false }: HeroSectionProps) {
  const title = isTVShow ? (featured as TVShow).name : (featured as Movie).title;
  const releaseDate = isTVShow 
    ? (featured as TVShow).first_air_date 
    : (featured as Movie).release_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const hasBackdrop = !!featured.backdrop_path;
  const backdropUrl = hasBackdrop ? getBackdropUrl(featured.backdrop_path) : getImageUrl(featured.poster_path, 'w780');
  const overview = featured.overview || 'No description available.';

  // Format genres (mock for now, would need API call for full genre names)
  // In a real app, you'd fetch genre names from TMDB API
  const genres = featured.genres?.map(g => g.name) || ['Action', 'Adventure', 'Crime'];

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
      {/* Background Image: backdrop preferred, poster as fallback */}
      <div className="absolute inset-0 bg-zinc-900">
        <Image
          src={backdropUrl}
          alt={title || `${isTVShow ? 'TV Show' : 'Movie'} backdrop`}
          fill
          className={`object-cover ${!hasBackdrop ? 'scale-110 blur-sm' : ''}`}
          priority
          sizes="100vw"
        />
         {/* Gradient overlay for text readability  */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Large Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-4 uppercase tracking-tight">
            {title}
          </h1>

          {/* Metadata */}
          <div className="mb-4 text-white/90">
            <span className="text-lg font-semibold">{title}</span>
            {year && (
              <>
                <span className="mx-2">/</span>
                <span>{year}</span>
              </>
            )}
            {genres.length > 0 && (
              <>
                <span className="mx-2">/</span>
                <span>{genres.join(' / ')}</span>
              </>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-2xl line-clamp-3">
            {overview}
          </p>

          {/* Related Items Carousel */}
          {relatedItems.length > 0 && (
            <div className="mt-8">
              <div 
                className="flex gap-3  scrollbar-hide pb-2 -mx-1 pr-4 sm:pr-6 lg:pr-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {relatedItems.slice(0, 8).map((item) => {
                  const itemTitle = 'name' in item ? item.name : item.title;
                  const itemHref = 'name' in item ? `/tv-shows/${item.id}` : `/movies/${item.id}`;
                  const isItemTVShow = 'name' in item;
                  return (
                    <Link key={item.id} href={itemHref} className="flex-shrink-0 w-24 h-32 relative rounded overflow-hidden group cursor-pointer">
                      <Image
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={itemTitle || `${isItemTVShow ? 'TV Show' : 'Movie'} poster`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="96px"
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
