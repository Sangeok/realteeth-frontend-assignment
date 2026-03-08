'use client';

import {
  convertLatLngToGrid,
  fetchWeather,
  parseWeatherSummary,
  type FetchWeatherData,
  type UseWeatherQueryParams,
  type WeatherQueryData,
} from '@/fsd/entities/weather';
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';

const WEATHER_REFRESH_INTERVAL = 5 * 60 * 1000;

type GridWeatherLookupParams = {
  nx: number;
  ny: number;
  latitude?: never;
  longitude?: never;
};

type LatLngWeatherLookupParams = {
  latitude: number;
  longitude: number;
  nx?: never;
  ny?: never;
};

export type UseWeatherLookupParams =
  | GridWeatherLookupParams
  | LatLngWeatherLookupParams;

export function canLookupWeather(
  params: UseWeatherQueryParams,
): params is UseWeatherLookupParams {
  if ('nx' in params) {
    return typeof params.nx === 'number' && typeof params.ny === 'number';
  }

  return (
    typeof params.latitude === 'number' && typeof params.longitude === 'number'
  );
}

function resolveLookupCoords(params: UseWeatherLookupParams) {
  if ('nx' in params) {
    return {
      nx: String(params.nx),
      ny: String(params.ny),
    };
  }

  return convertLatLngToGrid(params.latitude, params.longitude);
}

export function useWeatherLookup(
  params: UseWeatherLookupParams,
): UseSuspenseQueryResult<WeatherQueryData, Error> {
  const coords = resolveLookupCoords(params);

  return useSuspenseQuery<FetchWeatherData, Error, WeatherQueryData>({
    queryKey: ['weather', coords.nx, coords.ny],
    queryFn: () => fetchWeather({ nx: coords.nx, ny: coords.ny }),
    select: (data) => ({
      statusCode: data.statusCode,
      summary: parseWeatherSummary(data.data),
    }),
    staleTime: WEATHER_REFRESH_INTERVAL,
    refetchInterval: WEATHER_REFRESH_INTERVAL,
  });
}
