'use client';

import type { District } from '@/fsd/entities/district';
import type { LocationState } from '@/fsd/features/current-location';
import {
  FavoriteToggleButton,
  MAX_FAVORITES,
  type FavoriteItem,
} from '@/fsd/features/favorites';
import {
  EmptyView,
  type UseWeatherLookupParams,
  useWeatherLookup,
  WeatherErrorView,
  WeatherSummarySection,
} from '@/fsd/features/weather-lookup';
import { MapPin } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useWeatherDashboard } from '../model/hooks/use-weather-dashboard';
import { WeatherDashboardSkeleton } from './weather-dashboard-skeleton';

type WeatherLookupContentProps = {
  weatherParams: UseWeatherLookupParams;
  emptyMessage: string;
};

type WeatherDashboardProps = {
  favorites: FavoriteItem[];
  addFavorite: (district: District) => void;
  removeFavorite: (id: string) => void;
  selectedDistrict: District | null;
  locationState: LocationState;
  onSwitchToCurrentLocation?: () => void;
};

function WeatherLookupContent({
  weatherParams,
  emptyMessage,
}: WeatherLookupContentProps) {
  const weatherQuery = useWeatherLookup(weatherParams);

  if (!weatherQuery.data.summary) {
    return <EmptyView message={emptyMessage} />;
  }

  return <WeatherSummarySection summary={weatherQuery.data.summary} />;
}

export function WeatherDashboard({
  favorites,
  addFavorite,
  removeFavorite,
  selectedDistrict,
  locationState,
  onSwitchToCurrentLocation,
}: WeatherDashboardProps) {
  const {
    weatherParams,
    emptyMessage,
    shouldShowSkeleton,
    shouldShowEmptyWithoutQuery,
    showDistrictControls,
  } = useWeatherDashboard({ selectedDistrict, locationState });

  const isFavorited = selectedDistrict
    ? favorites.some((favorite) => favorite.id === selectedDistrict.raw)
    : false;
  const isFull = favorites.length >= MAX_FAVORITES;

  const handleAddFavorite = () => {
    if (!selectedDistrict || isFavorited || isFull) {
      return;
    }

    addFavorite(selectedDistrict);
  };

  const handleRemoveFavorite = () => {
    if (!selectedDistrict || !isFavorited) {
      return;
    }

    removeFavorite(selectedDistrict.raw);
  };

  return (
    <div className="flex flex-col gap-6">
      {showDistrictControls && (
        <div className="flex flex-wrap items-center gap-3">
          {onSwitchToCurrentLocation && (
            <button
              type="button"
              onClick={onSwitchToCurrentLocation}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/50 px-4 py-1.5 text-sm font-medium text-neutral-700 backdrop-blur-md hover:bg-white/70 dark:border-white/10 dark:bg-black/40 dark:text-neutral-300"
            >
              <MapPin className="h-4 w-4" />
              현재 위치로 돌아가기
            </button>
          )}
          <FavoriteToggleButton
            isFavorited={isFavorited}
            isFull={isFull}
            onAdd={handleAddFavorite}
            onRemove={handleRemoveFavorite}
          />
        </div>
      )}

      {weatherParams && (
        <ErrorBoundary fallback={<WeatherErrorView />}>
          <Suspense fallback={<WeatherDashboardSkeleton />}>
            <WeatherLookupContent
              weatherParams={weatherParams}
              emptyMessage={emptyMessage}
            />
          </Suspense>
        </ErrorBoundary>
      )}
      {shouldShowSkeleton && <WeatherDashboardSkeleton />}
      {shouldShowEmptyWithoutQuery && <EmptyView message={emptyMessage} />}
    </div>
  );
}
