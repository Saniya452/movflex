const WATCHLIST_KEY = 'movflex-watchlist';

export type WatchlistItem = {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  poster_path?: string | null;
};

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isInWatchlist(id: number, mediaType: 'movie' | 'tv'): boolean {
  return getWatchlist().some((w) => w.id === id && w.media_type === mediaType);
}

export function addToWatchlist(
  id: number,
  mediaType: 'movie' | 'tv',
  meta?: { title?: string; poster_path?: string | null }
): void {
  const list = getWatchlist();
  if (list.some((w) => w.id === id && w.media_type === mediaType)) return;
  list.push({
    id,
    media_type: mediaType,
    title: meta?.title,
    poster_path: meta?.poster_path ?? null,
  });
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export function removeFromWatchlist(id: number, mediaType: 'movie' | 'tv'): void {
  const list = getWatchlist().filter((w) => !(w.id === id && w.media_type === mediaType));
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export function toggleWatchlist(
  id: number,
  mediaType: 'movie' | 'tv',
  meta?: { title?: string; poster_path?: string | null }
): boolean {
  const currently = isInWatchlist(id, mediaType);
  if (currently) {
    removeFromWatchlist(id, mediaType);
    return false;
  }
  addToWatchlist(id, mediaType, meta);
  return true;
}
