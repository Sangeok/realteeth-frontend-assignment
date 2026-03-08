import { parseDistrict } from '@/fsd/entities/district';
import type { FavoriteItem } from '../model/types';

type StoredFavorite = {
  raw: string;
  alias: string | null;
};

function isStoredFavorite(value: unknown): value is StoredFavorite {
  if (typeof value !== 'object' || value === null) return false;
  if (!('raw' in value) || !('alias' in value)) return false;

  return (
    typeof value.raw === 'string' &&
    (typeof value.alias === 'string' || value.alias === null)
  );
}

export function normalizeFavoriteAlias(alias: string | null): string | null {
  if (alias === null) return null;

  const normalized = alias.trim();
  return normalized.length > 0 ? normalized : null;
}

function toFavoriteItem({ raw, alias }: StoredFavorite): FavoriteItem {
  return {
    id: raw,
    district: parseDistrict(raw),
    alias: normalizeFavoriteAlias(alias),
  };
}

function parseStoredFavorites(value: unknown, storageKey: string): StoredFavorite[] {
  if (!Array.isArray(value)) {
    console.warn('저장된 즐겨찾기 데이터 형식이 올바르지 않습니다.');
    localStorage.removeItem(storageKey);
    return [];
  }

  const validItems = value.filter(isStoredFavorite);
  if (validItems.length !== value.length) {
    console.warn('일부 즐겨찾기 데이터 형식이 올바르지 않습니다.');
    localStorage.setItem(storageKey, JSON.stringify(validItems));
  }

  return validItems;
}

export function loadFavoritesFromStorage(storageKey: string): FavoriteItem[] {
  try {
    const rawJson = localStorage.getItem(storageKey);
    if (!rawJson) return [];

    const parsed: unknown = JSON.parse(rawJson);
    const stored = parseStoredFavorites(parsed, storageKey);

    return stored.map(toFavoriteItem);
  } catch (error) {
    console.error('즐겨찾기 데이터를 불러오는 중 오류가 발생했습니다:', error);
    localStorage.removeItem(storageKey);
    return [];
  }
}

export function saveFavoritesToStorage(storageKey: string, items: FavoriteItem[]): void {
  try {
    const stored: StoredFavorite[] = items.map(({ id, alias }) => ({
      raw: id,
      alias,
    }));

    localStorage.setItem(storageKey, JSON.stringify(stored));
  } catch (error) {
    console.error('즐겨찾기 데이터를 저장하는 중 오류가 발생했습니다:', error);
  }
}
