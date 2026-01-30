import axios from 'axios';
import type { Movie, TVShow, TMDBResponse, GenreListResponse, DiscoverMovieParams, DiscoverTVParams, Genre } from '@/types';

// Map genre_ids to names using API genre list (for HeroSection, cards, etc.)
export function getGenreNamesFromIds(genreIds: number[] | undefined, genreList: Genre[]): string[] {
  if (!genreIds?.length || !genreList?.length) return [];
  const map = new Map(genreList.map((g) => [g.id, g.name]));
  return genreIds.map((id) => map.get(id)).filter(Boolean) as string[];
}

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

// TMDB API client setup
const tmdbClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_API_URL ?? TMDB_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  },
});

// Helper function to get full image URL
export function getImageUrl(path: string | null, size: 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '/images/logo-dark-transparent.png';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Helper function to get backdrop URL
export function getBackdropUrl(path: string | null): string {
  return getImageUrl(path, 'original');
}

// TMDB API functions
export async function getMovies(): Promise<Movie[]> {
  const response = await tmdbClient.get<TMDBResponse<Movie>>('/movie/popular');
  return response.data.results;
}
 // Get movie by id
export async function getMovieById(id: number): Promise<Movie> {
  const response = await tmdbClient.get<Movie>(`/movie/${id}`);
  return response.data;
}

// Get TV shows
export async function getTVShows(): Promise<TVShow[]> {
  const response = await tmdbClient.get<TMDBResponse<TVShow>>('/tv/popular');
  return response.data.results;
}

// Get TV show by id
export async function getTVShowById(id: number): Promise<TVShow> {
  const response = await tmdbClient.get<TVShow>(`/tv/${id}`);
  return response.data;
}

// Get trending content (all media types)
export async function getTrending(): Promise<(Movie | TVShow)[]> {
  const response = await tmdbClient.get<TMDBResponse<Movie | TVShow>>('/trending/all/week');
  return response.data.results;
}

// Get featured/trending movies for hero section
export async function getFeaturedMovie(): Promise<Movie | null> {
  try {
    const response = await tmdbClient.get<TMDBResponse<Movie>>('/movie/now_playing');
    const movies = response.data.results.filter(m => m.backdrop_path);
    return movies[0] || null;
  } catch {
    return null;
  }
}

// Get new releases (recent movies)
export async function getNewReleases(): Promise<Movie[]> {
  const response = await tmdbClient.get<TMDBResponse<Movie>>('/movie/now_playing');
  return response.data.results;
}

// Get top rated movies
export async function getTopRatedMovies(): Promise<Movie[]> {
  const response = await tmdbClient.get<TMDBResponse<Movie>>('/movie/top_rated');
  return response.data.results;
}

// ——— Dynamic filters & search ———

// Genre lists for filter dropdowns (and mapping genre_ids → names)
export async function getMovieGenres(): Promise<GenreListResponse['genres']> {
  const response = await tmdbClient.get<GenreListResponse>('/genre/movie/list');
  return response.data.genres;
}

export async function getTVGenres(): Promise<GenreListResponse['genres']> {
  const response = await tmdbClient.get<GenreListResponse>('/genre/tv/list');
  return response.data.genres;
}

// Discover movies with genre + year filters
export async function discoverMovies(params: DiscoverMovieParams = {}): Promise<{ results: Movie[]; total_pages: number }> {
  const { with_genres, primary_release_year, page = 1, sort_by = 'popularity.desc' } = params;
  const response = await tmdbClient.get<TMDBResponse<Movie>>('/discover/movie', {
    params: {
      sort_by,
      page,
      ...(with_genres && { with_genres }),
      ...(primary_release_year && { primary_release_year }),
    },
  });
  return { results: response.data.results, total_pages: response.data.total_pages };
}

// Discover TV with genre + year filters
export async function discoverTV(params: DiscoverTVParams = {}): Promise<{ results: TVShow[]; total_pages: number }> {
  const { with_genres, first_air_date_year, page = 1, sort_by = 'popularity.desc' } = params;
  const response = await tmdbClient.get<TMDBResponse<TVShow>>('/discover/tv', {
    params: {
      sort_by,
      page,
      ...(with_genres && { with_genres }),
      ...(first_air_date_year && { first_air_date_year }),
    },
  });
  return { results: response.data.results, total_pages: response.data.total_pages };
}

// Multi search (movies + TV + people) for search bar
export async function searchMulti(query: string, page = 1): Promise<{ results: (Movie | TVShow)[]; total_pages: number }> {
  if (!query.trim()) return { results: [], total_pages: 0 };
  const response = await tmdbClient.get<TMDBResponse<Movie | TVShow>>('/search/multi', {
    params: { query: query.trim(), page },
  });
  // Filter to only movie/tv (exclude person)
  const results = (response.data.results || []).filter(
    (r): r is Movie | TVShow => r.media_type === 'movie' || r.media_type === 'tv'
  );
  return { results, total_pages: response.data.total_pages };
}

export async function searchMovies(query: string, page = 1): Promise<{ results: Movie[]; total_pages: number }> {
  if (!query.trim()) return { results: [], total_pages: 0 };
  const response = await tmdbClient.get<TMDBResponse<Movie>>('/search/movie', {
    params: { query: query.trim(), page },
  });
  return { results: response.data.results, total_pages: response.data.total_pages };
}

export async function searchTVShows(query: string, page = 1): Promise<{ results: TVShow[]; total_pages: number }> {
  if (!query.trim()) return { results: [], total_pages: 0 };
  const response = await tmdbClient.get<TMDBResponse<TVShow>>('/search/tv', {
    params: { query: query.trim(), page },
  });
  return { results: response.data.results, total_pages: response.data.total_pages };
}

export default tmdbClient;
