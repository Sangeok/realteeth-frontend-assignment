'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchWeather, type FetchWeatherData } from '../api/fetch-weather';
import { convertLatLngToGrid } from './convert-lat-lng-to-grid';
import { parseWeatherSummary, type WeatherSummary } from './parse-weather-summary';

export type UseWeatherQueryParams =
  | {
      latitude: number | null;
      longitude: number | null;
      nx?: never;
      ny?: never;
    }
  | {
      nx: number | null;
      ny: number | null;
      latitude?: never;
      longitude?: never;
    };

export type WeatherQueryData = {
  statusCode: number;
  summary: WeatherSummary | null;
};

const WEATHER_REFRESH_INTERVAL = 5 * 60 * 1000;

function resolveCoords(params: UseWeatherQueryParams) {
  if ('nx' in params && params.nx !== null && params.ny !== null) {
    return {
      nx: String(params.nx),
      ny: String(params.ny),
    };
  }

  if (
    'latitude' in params &&
    typeof params.latitude === 'number' &&
    typeof params.longitude === 'number'
  ) {
    return convertLatLngToGrid(params.latitude, params.longitude);
  }

  return null;
}

export function useWeatherQuery(
  params: UseWeatherQueryParams,
): UseQueryResult<WeatherQueryData, Error> {
  const coords = resolveCoords(params);

  return useQuery<FetchWeatherData, Error, WeatherQueryData>({
    queryKey: ['weather', coords?.nx, coords?.ny],
    queryFn: () => {
      if (!coords) throw new Error('coords is null');
      return fetchWeather({ nx: coords.nx, ny: coords.ny });
    },
    select: (data) => ({
      statusCode: data.statusCode,
      summary: parseWeatherSummary(data.data),
    }),
    enabled: coords !== null,
    staleTime: WEATHER_REFRESH_INTERVAL,
    refetchInterval: WEATHER_REFRESH_INTERVAL,
  });
}
