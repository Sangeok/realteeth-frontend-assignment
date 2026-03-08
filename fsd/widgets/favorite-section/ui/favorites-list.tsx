'use client';

import { type FavoriteItem } from '@/fsd/features/favorites';
import { ErrorBoundary } from 'react-error-boundary';
import { FavoriteWeatherCardErrorFallback } from './favorite-weather-card-error-fallback';
import { FavoriteWeatherCard } from './favorite-weather-card';

type FavoritesListProps = {
  favorites: FavoriteItem[];
  removeFavorite: (id: string) => void;
  updateAlias: (id: string, alias: string) => void;
};

export function FavoritesList({ favorites, removeFavorite, updateAlias }: FavoritesListProps) {
  const isEmpty = favorites.length === 0;

  if(isEmpty) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-2xl border border-dashed border-white/30 bg-white/20 p-8 text-center dark:border-white/10 dark:bg-black/20">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            장소를 검색한 후 즐겨찾기에 추가해 보세요.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((item) => (
          <ErrorBoundary
            key={item.id}
            fallback={<FavoriteWeatherCardErrorFallback />}
          >
            <FavoriteWeatherCard
              item={item}
              onRemove={removeFavorite}
              onUpdateAlias={updateAlias}
            />
          </ErrorBoundary>
        ))}
      </div>
    </section>
  );
}
