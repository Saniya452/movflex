// Genre type
export interface Genre {
  id: number;
  name: string;
}

// Movie type
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genres?: Genre[];
  genre_ids?: number[];
  media_type?: 'movie' | 'tv';
}

// TV Show type
export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genres?: Genre[];
  genre_ids?: number[];
  media_type?: 'movie' | 'tv';
  number_of_episodes?: number;
  number_of_seasons?: number;
}

// TMDB API Response wrapper
export interface TMDBResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}
