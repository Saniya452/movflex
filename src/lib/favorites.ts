const FAVORITES_KEY = 'movflex-favorites';

export type FavoriteItem = { id: number; media_type: 'movie' | 'tv' };

export function getFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: number, mediaType: 'movie' | 'tv'): boolean {
  return getFavorites().some((f) => f.id === id && f.media_type === mediaType);
}

export function addFavorite(id: number, mediaType: 'movie' | 'tv'): void {
  const list = getFavorites();
  if (list.some((f) => f.id === id && f.media_type === mediaType)) return;
  list.push({ id, media_type: mediaType });
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

export function removeFavorite(id: number, mediaType: 'movie' | 'tv'): void {
  const list = getFavorites().filter((f) => !(f.id === id && f.media_type === mediaType));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

export function toggleFavorite(id: number, mediaType: 'movie' | 'tv'): boolean {
  const currently = isFavorite(id, mediaType);
  if (currently) {
    removeFavorite(id, mediaType);
    return false;
  }
  addFavorite(id, mediaType);
  return true;
}
