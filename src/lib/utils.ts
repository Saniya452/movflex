export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
// Format date to readable string
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format rating (e.g., 8.5 -> "8.5/10")
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)}/10`;
}

// TMDB returns 20 results per page (fixed by API); we fetch 2 pages for 40 items
export const RESULTS_PER_PAGE = 20;
export const INITIAL_ITEMS_COUNT = 40;

// Year options for filter dropdowns (current year down to 1950)
const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 1950;
export const FILTER_YEARS = Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) => CURRENT_YEAR - i);
