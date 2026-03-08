'use client';

import type { District } from '@/fsd/entities/district';
import type { LocationState } from '@/fsd/features/current-location';
import { useLocationHeader } from '../model/hooks/use-location-header';
import { Loader2, MapPin, RefreshCw } from 'lucide-react';

type LocationHeaderProps = {
  locationState: LocationState;
  requestLocation: () => void;
  selectedDistrict: District | null;
  onSwitchToCurrentLocation: () => void;
};

export function LocationHeader(props: LocationHeaderProps) {
  const { locationLabel, refreshLabel, handleRefresh, statusMessage } = useLocationHeader(props);

  return (
    <header className="flex flex-col items-start gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/50 px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/40 dark:text-neutral-300">
        <MapPin className="h-4 w-4 text-indigo-500" />
        <span>{locationLabel}</span>
        <button
          type="button"
          onClick={handleRefresh}
          title={refreshLabel}
          aria-label={refreshLabel}
          className="inline-flex items-center justify-center"
        >
          <RefreshCw className="h-4 w-4 text-indigo-500" />
        </button>
      </div>

      <div className="min-h-[1.25rem]">
        {statusMessage?.type === 'loading' && (
          <p className="inline-flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {statusMessage.text}
          </p>
        )}
        {statusMessage?.type === 'error' && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            {statusMessage.text}
          </p>
        )}
      </div>

      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
        오늘 날씨
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        장소를 검색하거나 현재 위치를 사용하세요.
      </p>
    </header>
  );
}
