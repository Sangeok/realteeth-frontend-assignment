'use client';

import { MAX_FAVORITES, type FavoriteItem } from '@/fsd/features/favorites';
import { FavoritesList } from './favorites-list';
import { Star } from 'lucide-react';

type FavoriteSectionProps = {
  favorites: FavoriteItem[];
  removeFavorite: (id: string) => void;
  updateAlias: (id: string, alias: string) => void;
};

export function FavoriteSection({
  favorites,
  removeFavorite,
  updateAlias,
}: FavoriteSectionProps) {
  return (
    <section className="space-y-4">
      <header className="flex items-center gap-2">
        <Star className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">즐겨찾기</h2>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          ({favorites.length}/{MAX_FAVORITES})
        </span>
      </header>
      <FavoritesList
        favorites={favorites}
        removeFavorite={removeFavorite}
        updateAlias={updateAlias}
      />
    </section>
  );
}
