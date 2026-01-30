import axios from 'axios';
import type { Movie, TVShow, TMDBResponse } from '@/types';

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

export default tmdbClient;
