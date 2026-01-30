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
