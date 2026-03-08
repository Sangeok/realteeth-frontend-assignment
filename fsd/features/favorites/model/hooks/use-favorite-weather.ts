import { lookupDistrictGrid } from '@/fsd/entities/district';
import { useWeatherQuery } from '@/fsd/entities/weather';
import type { FavoriteItem } from '../types';

export type FavoriteWeatherState = 'loading' | 'error' | 'ready' | 'empty';

type UseFavoriteWeatherResult = {
  displayName: string;
  districtDisplayName: string;
  districtHref: string;
  weatherState: FavoriteWeatherState;
  currentTemperatureText: string;
  minimumTemperatureText: string;
  maximumTemperatureText: string;
};

function formatTemperatureText(value: string | null | undefined): string {
  if (value === null || value === undefined || value.length === 0) return '-';
  return `${value}°`;
}

function resolveWeatherState({
  hasData,
  isPending,
  isError,
}: {
  hasData: boolean;
  isPending: boolean;
  isError: boolean;
}): FavoriteWeatherState {
  if (hasData) return 'ready';
  if (isPending) return 'loading';
  if (isError) return 'error';
  return 'empty';
}

export function useFavoriteWeather(item: FavoriteItem): UseFavoriteWeatherResult {
  const districtGrid = lookupDistrictGrid(item.district.raw);
  const weatherParams = districtGrid
    ? { nx: districtGrid.nx, ny: districtGrid.ny }
    : { latitude: null, longitude: null };

  const weatherQuery = useWeatherQuery(weatherParams);

  const currentTemperature = weatherQuery.data?.summary?.currentTemperature?.temperatureCelsius;
  const minimumTemperature = weatherQuery.data?.summary?.forecast?.minimumTemperatureCelsius;
  const maximumTemperature = weatherQuery.data?.summary?.forecast?.maximumTemperatureCelsius;

  const hasWeatherData =
    (currentTemperature !== null && currentTemperature !== undefined) ||
    (minimumTemperature !== null && minimumTemperature !== undefined) ||
    (maximumTemperature !== null && maximumTemperature !== undefined);

  return {
    displayName: item.alias ?? item.district.displayName,
    districtDisplayName: item.district.displayName,
    districtHref: `/district/${encodeURIComponent(item.district.raw)}`,
    weatherState: resolveWeatherState({
      hasData: hasWeatherData,
      isPending: weatherQuery.isPending,
      isError: weatherQuery.isError,
    }),
    currentTemperatureText: formatTemperatureText(currentTemperature),
    minimumTemperatureText: formatTemperatureText(minimumTemperature),
    maximumTemperatureText: formatTemperatureText(maximumTemperature),
  };
}
