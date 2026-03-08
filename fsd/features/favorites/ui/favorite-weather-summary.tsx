'use client';

import { FavoriteCardSkeleton } from './favorite-card-skeleton';

type FavoriteWeatherSummaryProps = {
  weatherState: 'loading' | 'error' | 'ready' | 'empty';
  currentTemperatureText: string;
  minimumTemperatureText: string;
  maximumTemperatureText: string;
};

export function FavoriteWeatherSummary({
  weatherState,
  currentTemperatureText,
  minimumTemperatureText,
  maximumTemperatureText,
}: FavoriteWeatherSummaryProps) {
  if (weatherState === 'loading') {
    return <FavoriteCardSkeleton />;
  }

  if (weatherState === 'error') {
    return (
      <p className="text-xs text-red-500 dark:text-red-400">
        날씨 정보를 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-3xl font-bold text-neutral-900 dark:text-white">
        {currentTemperatureText}
      </span>
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span>최저 {minimumTemperatureText}</span>
        <span>최고 {maximumTemperatureText}</span>
      </div>
    </div>
  );
}
