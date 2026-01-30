import Link from 'next/link';
import { searchMulti, searchMovies, searchTVShows } from '@/lib/tmdb';
import GridWithLoadMore from '@/components/ui/GridWithLoadMore';

export const metadata = {
  title: 'Search',
  description: 'Search movies and TV shows.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? '').trim();
  const type = (params.type === 'movie' || params.type === 'tv' ? params.type : 'all') as 'all' | 'movie' | 'tv';

  if (!query) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center text-zinc-400 max-w-md">
          <p className="text-lg mb-2">Enter a search term above.</p>
          <p className="text-sm">Search for movies, TV shows, or actors.</p>
        </div>
      </div>
    );
  }

  const searchResult =
    type === 'movie'
      ? await searchMovies(query, 1)
      : type === 'tv'
        ? await searchTVShows(query, 1)
        : await searchMulti(query, 1);
  const { results, total_pages: totalPages } = searchResult;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Search: &ldquo;{query}&rdquo;
          {type !== 'all' && (
            <span className="text-lg font-normal text-zinc-400 ml-2">
              ({type === 'movie' ? 'Movies' : 'TV Shows'})
            </span>
          )}
        </h1>

        {results.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            <p className="text-lg mb-2">No movies or TV shows found.</p>
            <Link href="/" className="text-emerald-400 hover:underline">
              Back to home
            </Link>
          </div>
        ) : (
          <GridWithLoadMore
            mode="search"
            initialItems={results}
            totalPages={totalPages}
            query={query}
            type={type}
          />
        )}
      </div>
    </div>
  );
}
