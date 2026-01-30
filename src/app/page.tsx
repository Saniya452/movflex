import HeroSection from '@/components/ui/HeroSection';
import ContentCarousel from '@/components/ui/ContentCarousel';
import { getFeaturedMovie, getTrending, getNewReleases, getTopRatedMovies } from '@/lib/tmdb';
import type { Movie, TVShow } from '@/types';

export default async function Home() {
  try {
    // Fetch data in parallel
    const [featuredMovie, trending, newReleases, topRated] = await Promise.all([
      getFeaturedMovie(),
      getTrending(),
      getNewReleases(),
      getTopRatedMovies(),
    ]);

    // Use featured movie or first trending item with backdrop as hero
    const heroItem = featuredMovie || trending.find((item) => item.backdrop_path) as Movie | TVShow | undefined;
    const relatedItems = trending.filter((item) => item.id !== heroItem?.id).slice(0, 8);

    return (
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        {heroItem && (
          <HeroSection 
            featured={heroItem} 
            relatedItems={relatedItems}
            isTVShow={heroItem.media_type === 'tv' || 'name' in heroItem}
          />
        )}

        {/* Content Sections */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* New Releases */}
          {newReleases.length > 0 && (
            <ContentCarousel 
              title="New Releases" 
              items={newReleases}
              showSwitch={true}
            />
          )}

          {/* Trending Now */}
          {trending.length > 0 && (
            <ContentCarousel 
              title="Trending Now" 
              items={trending.slice(0, 20)}
            />
          )}

          {/* Top Rated */}
          {topRated.length > 0 && (
            <ContentCarousel 
              title="Top Rated" 
              items={topRated.slice(0, 20)}
            />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Unable to load content</h1>
          <p className="text-zinc-400">Please check your TMDB API configuration.</p>
        </div>
      </div>
    );
  }
}
