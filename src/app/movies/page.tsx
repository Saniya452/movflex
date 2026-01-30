import { Suspense } from 'react';
import Link from 'next/link';
import { discoverMovies, getMovieGenres } from '@/lib/tmdb';
import { FILTER_YEARS } from '@/lib/utils';
import DiscoverFilters from '@/components/ui/DiscoverFilters';
import MovieCard from '@/components/ui/MovieCard';

export const metadata = {
  title: 'Movies',
  description: 'Browse movies by genre and year.',
};

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; year?: string; page?: string }>;
}) {
  const params = await searchParams;
  const genre = params.genre ?? '';
  const year = params.year ?? '';
  const page = Number(params.page) || 1;

  const [genresRes, discoverRes] = await Promise.all([
    getMovieGenres(),
    discoverMovies({
      with_genres: genre || undefined,
      primary_release_year: year ? Number(year) : undefined,
      page,
    }),
  ]);

  const { results: movies, total_pages: totalPages } = discoverRes;
  const hasFilters = !!genre || !!year;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Movies</h1>
          <Suspense fallback={<div className="h-10 w-64 bg-zinc-800 rounded-lg animate-pulse" />}>
            <DiscoverFilters
              basePath="/movies"
              genres={genresRes}
              yearOptions={FILTER_YEARS}
              currentGenre={genre}
              currentYear={year}
            />
          </Suspense>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            <p className="text-lg mb-2">No movies found.</p>
            {hasFilters && (
              <Link href="/movies" className="text-emerald-400 hover:underline">
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} item={movie} isTVShow={false} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/movies?${new URLSearchParams({
                      ...(genre && { genre }),
                      ...(year && { year }),
                      page: String(page - 1),
                    }).toString()}`}
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
                    href={`/movies?${new URLSearchParams({
                      ...(genre && { genre }),
                      ...(year && { year }),
                      page: String(page + 1),
                    }).toString()}`}
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
