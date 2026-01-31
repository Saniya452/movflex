import { Suspense } from 'react';
import Link from 'next/link';
import { discoverMovies, getMovieGenres } from '@/lib/tmdb';
import { FILTER_YEARS } from '@/lib/utils';
import DiscoverFilters from '@/components/ui/DiscoverFilters';
import GridWithLoadMore from '@/components/ui/GridWithLoadMore';

export const metadata = {
  title: 'Movies',
  description: 'Browse movies by genre and year.',
};

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; year?: string }>;
}) {
  const params = await searchParams;
  const genre = params.genre ?? '';
  const year = params.year ?? '';

  const [genresRes, page1Res, page2Res] = await Promise.all([
    getMovieGenres(),
    discoverMovies({
      with_genres: genre || undefined,
      primary_release_year: year ? Number(year) : undefined,
      page: 1,
    }),
    discoverMovies({
      with_genres: genre || undefined,
      primary_release_year: year ? Number(year) : undefined,
      page: 2,
    }),
  ]);

  const movies = [...(page1Res?.results ?? []), ...(page2Res?.results ?? [])];
  const totalPages = page1Res?.total_pages ?? 1;
  const hasFilters = !!genre || !!year;

  return (
    <div className="min-h-screen bg-black">
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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

        {movies?.length === 0 ? (
          <div className="text-center py-12 sm:py-16 text-zinc-400 px-4">
            <p className="text-base sm:text-lg mb-2">No movies found – try another search</p>
            {hasFilters && (
              <Link href="/movies" className="text-emerald-400 hover:underline text-sm sm:text-base">
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <GridWithLoadMore
            mode="movies"
            initialItems={movies ?? []}
            initialPage={2}
            totalPages={totalPages}
            genre={genre}
            year={year}
          />
        )}
      </div>
    </div>
  );
}
