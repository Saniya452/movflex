import Link from 'next/link';
import { searchMulti, searchMovies, searchTVShows } from '@/lib/tmdb';
import MovieCard from '@/components/ui/MovieCard';

export const metadata = {
  title: 'Search',
  description: 'Search movies and TV shows.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; type?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? '').trim();
  const page = Number(params.page) || 1;
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
      ? await searchMovies(query, page)
      : type === 'tv'
        ? await searchTVShows(query, page)
        : await searchMulti(query, page);
  const { results, total_pages: totalPages } = searchResult;
  const isTV = type === 'tv';

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
        <p className="text-zinc-400 text-sm mb-6">
          {results.length > 0 ? `${results.length} result(s)` : 'No results'}
        </p>

        {results.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            <p className="text-lg mb-2">No movies or TV shows found.</p>
            <Link href="/" className="text-emerald-400 hover:underline">
              Back to home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {results.map((item) => (
                <MovieCard
                  key={type === 'all' ? `${(item as { media_type: string }).media_type}-${item.id}` : item.id}
                  item={item}
                  isTVShow={isTV || (item as { media_type?: string }).media_type === 'tv'}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}${type !== 'all' ? `&type=${type}` : ''}`}
                    className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 text-sm"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 text-zinc-400 text-sm">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}${type !== 'all' ? `&type=${type}` : ''}`}
                    className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 text-sm"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
