'use server';

import { discoverMovies, discoverTV } from '@/lib/tmdb';
import { searchMulti, searchMovies, searchTVShows } from '@/lib/tmdb';
import type { Movie, TVShow } from '@/types';

export async function getDiscoverMoviesPage(
  page: number,
  genre?: string,
  year?: string
): Promise<{ results: Movie[]; total_pages: number }> {
  return discoverMovies({
    page,
    with_genres: genre || undefined,
    primary_release_year: year ? Number(year) : undefined,
  });
}

export async function getDiscoverTVPage(
  page: number,
  genre?: string,
  year?: string
): Promise<{ results: TVShow[]; total_pages: number }> {
  return discoverTV({
    page,
    with_genres: genre || undefined,
    first_air_date_year: year ? Number(year) : undefined,
  });
}

type SearchType = 'all' | 'movie' | 'tv';

export async function getSearchPage(
  query: string,
  page: number,
  type: SearchType = 'all'
): Promise<{ results: (Movie | TVShow)[]; total_pages: number }> {
  if (type === 'movie') return searchMovies(query, page);
  if (type === 'tv') return searchTVShows(query, page);
  return searchMulti(query, page);
}
