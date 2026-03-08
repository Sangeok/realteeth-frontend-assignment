'use client';

import type { District } from '@/fsd/entities/district';
import type { LocationState } from '@/fsd/features/current-location';
import { useReverseGeocode } from '@/fsd/shared/api';

type UseLocationHeaderParams = {
  locationState: LocationState;
  requestLocation: () => void;
  selectedDistrict: District | null;
  onSwitchToCurrentLocation: () => void;
};

export type StatusMessage =
  | { type: 'loading'; text: string }
  | { type: 'error'; text: string }
  | null;

export type LocationHeaderModel = {
  locationLabel: string;
  refreshLabel: string;
  handleRefresh: () => void;
  statusMessage: StatusMessage;
};

function getCoordinateLabel(locationState: LocationState): string | null {
  if (locationState.status !== 'success') {
    return null;
  }

  return `${locationState.location.latitude.toFixed(4)}, ${locationState.location.longitude.toFixed(4)}`;
}

function getLocationLabel({
  selectedDistrict,
  reverseGeocodeAddress,
  coordinateLabel,
}: {
  selectedDistrict: District | null;
  reverseGeocodeAddress: string | null | undefined;
  coordinateLabel: string | null;
}): string {
  if (selectedDistrict) {
    return selectedDistrict.displayName;
  }

  return reverseGeocodeAddress ?? coordinateLabel ?? '위치를 확인할 수 없음';
}

function getStatusMessage({
  selectedDistrict,
  locationState,
  reverseGeocodeStatus,
  isReverseGeocodeError,
  isReverseGeocodePending,
  isLocatingCurrentLocation,
}: {
  selectedDistrict: District | null;
  locationState: LocationState;
  reverseGeocodeStatus: string | undefined;
  isReverseGeocodeError: boolean;
  isReverseGeocodePending: boolean;
  isLocatingCurrentLocation: boolean;
}): StatusMessage {
  if (selectedDistrict) {
    return null;
  }

  if (locationState.status === 'error') {
    return {
      type: 'error',
      text: '현재 위치를 불러오지 못했습니다. 장소를 검색하거나 현재 위치를 다시 시도해 주세요.',
    };
  }

  if (isReverseGeocodeError) {
    return { type: 'error', text: '좌표를 주소로 변환하지 못했습니다.' };
  }

  if (reverseGeocodeStatus === 'NOT_FOUND') {
    return { type: 'error', text: '해당 좌표에 대한 주소를 찾지 못했습니다.' };
  }

  if (isLocatingCurrentLocation) {
    return { type: 'loading', text: '현재 위치 확인 중...' };
  }

  if (isReverseGeocodePending) {
    return { type: 'loading', text: '좌표를 주소로 변환하는 중...' };
  }

  return null;
}

export function useLocationHeader({
  locationState,
  requestLocation,
  selectedDistrict,
  onSwitchToCurrentLocation,
}: UseLocationHeaderParams): LocationHeaderModel {
  const successLocation = locationState.status === 'success' ? locationState.location : null;

  const reverseGeocodeQuery = useReverseGeocode({
    latitude: selectedDistrict ? null : successLocation?.latitude ?? null,
    longitude: selectedDistrict ? null : successLocation?.longitude ?? null,
  });

  const isLocatingCurrentLocation =
    !selectedDistrict &&
    (locationState.status === 'idle' || locationState.status === 'locating');

  const locationLabel = getLocationLabel({
    selectedDistrict,
    reverseGeocodeAddress: reverseGeocodeQuery.data?.address,
    coordinateLabel: getCoordinateLabel(locationState),
  });

  const handleRefresh = selectedDistrict ? onSwitchToCurrentLocation : requestLocation;
  const refreshLabel = selectedDistrict ? '현재 위치로 돌아가기' : '현재 위치 새로고침';

  const statusMessage = getStatusMessage({
    selectedDistrict,
    locationState,
    reverseGeocodeStatus: reverseGeocodeQuery.data?.status,
    isReverseGeocodeError: reverseGeocodeQuery.isError,
    isReverseGeocodePending: reverseGeocodeQuery.isPending && !isLocatingCurrentLocation,
    isLocatingCurrentLocation,
  });

  return {
    locationLabel,
    refreshLabel,
    handleRefresh,
    statusMessage,
  };
}
