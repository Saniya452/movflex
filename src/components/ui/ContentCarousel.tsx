'use client';

import { useRef } from 'react';
import MovieCard from './MovieCard';
import type { Movie, TVShow } from '@/types';

interface ContentCarouselProps {
  title: string;
  items: (Movie | TVShow)[];
  isTVShow?: boolean;
}

export default function ContentCarousel({ 
  title, 
  items, 
  isTVShow = false 
}: ContentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 800;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {title}
          <span className="text-zinc-400">›</span>
        </h2>
      </div>
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 pr-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item, index) => {
            const mediaType = (item as Movie & { media_type?: string }).media_type ?? (isTVShow ? 'tv' : 'movie');
            return (
              <MovieCard
                key={`${mediaType}-${item.id}-${index}`}
                item={item}
                isTVShow={isTVShow}
              />
            );
          })}
        </div>
        {/* Scroll buttons - positioned on sides, not overlapping posters */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg transition-colors z-10 border border-white/10"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg transition-colors z-10 border border-white/10"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
