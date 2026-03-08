import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import type { District } from '@/fsd/entities/district';
import { MAX_FAVORITES } from '../../config';
import {
  normalizeFavoriteAlias,
  loadFavoritesFromStorage,
  saveFavoritesToStorage,
} from '../../lib/favorites-storage';
import type { FavoriteItem } from '../types';

export const FAVORITES_STORAGE_KEY = 'weather-favorites';

interface FavoritesState {
  favorites: FavoriteItem[];
  addFavorite: (district: District) => void;
  removeFavorite: (id: string) => void;
  updateAlias: (id: string, alias: string) => void;
  isFavorite: (id: string) => boolean;
}

type PersistedFavoritesState = Pick<FavoritesState, 'favorites'>;

const favoritesStorage: PersistStorage<PersistedFavoritesState> = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;

    return {
      state: {
        favorites: loadFavoritesFromStorage(name),
      },
      version: 0,
    };
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    saveFavoritesToStorage(name, value.state.favorites);
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (district) => {
        const { favorites } = get();
        const isFull = favorites.length >= MAX_FAVORITES;
        const alreadyAdded = favorites.some((f) => f.id === district.raw);

        if (isFull || alreadyAdded) return;

        const newFavorites = [
          ...favorites,
          { id: district.raw, district, alias: null },
        ];

        set({ favorites: newFavorites });
      },

      removeFavorite: (id) => {
        const { favorites } = get();
        const newFavorites = favorites.filter((f) => f.id !== id);

        set({ favorites: newFavorites });
      },

      updateAlias: (id, alias) => {
        const { favorites } = get();
        const normalizedAlias = normalizeFavoriteAlias(alias);

        set({
          favorites: favorites.map((f) =>
            f.id === id ? { ...f, alias: normalizedAlias } : f
          ),
        });
      },

      isFavorite: (id) => {
        return get().favorites.some((f) => f.id === id);
      },
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      partialize: ({ favorites }) => ({ favorites }),
      storage: favoritesStorage,
      skipHydration: true,
    }
  )
);
