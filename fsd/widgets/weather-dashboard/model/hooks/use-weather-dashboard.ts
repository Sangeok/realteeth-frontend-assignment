'use client';

import type { District } from '@/fsd/entities/district';
import type { CurrentLocation, LocationState } from '@/fsd/features/current-location';
import { canLookupWeather, type UseWeatherLookupParams } from '@/fsd/features/weather-lookup';
import { resolveWeatherParams } from '../resolve-weather-params';

type UseWeatherDashboardParams = {
  selectedDistrict: District | null;
  locationState: LocationState;
};

export type WeatherDashboardModel = {
  weatherParams: UseWeatherLookupParams | null;
  emptyMessage: string;
  shouldShowSkeleton: boolean;
  shouldShowEmptyWithoutQuery: boolean;
  showDistrictControls: boolean;
};

function getEmptyMessage({
  selectedDistrict,
  locationState,
}: UseWeatherDashboardParams): string {
  if (selectedDistrict) {
    return '해당 장소의 정보가 제공되지 않습니다.';
  }

  if (locationState.status === 'error') {
    return '현재 위치를 불러오지 못했습니다. 장소를 검색하거나 현재 위치를 다시 시도해 주세요.';
  }

  return '이 위치의 날씨 정보를 찾을 수 없습니다.';
}

export function useWeatherDashboard({
  selectedDistrict,
  locationState,
}: UseWeatherDashboardParams): WeatherDashboardModel {
  const successLocation: CurrentLocation | null =
    locationState.status === 'success' ? locationState.location : null;

  const resolvedParams = resolveWeatherParams(selectedDistrict, successLocation);
  const weatherParams = canLookupWeather(resolvedParams) ? resolvedParams : null;

  const isLocatingCurrentLocation =
    !selectedDistrict &&
    (locationState.status === 'idle' || locationState.status === 'locating');

  const emptyMessage = getEmptyMessage({ selectedDistrict, locationState });

  return {
    weatherParams,
    emptyMessage,
    shouldShowSkeleton: isLocatingCurrentLocation,
    shouldShowEmptyWithoutQuery: !isLocatingCurrentLocation && weatherParams === null,
    showDistrictControls: selectedDistrict !== null,
  };
}
