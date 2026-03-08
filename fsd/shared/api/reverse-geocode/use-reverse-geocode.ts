'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchReverseGeocode,
  type FetchReverseGeocodeData,
  type ReverseGeocodeResponse,
} from './fetch-reverse-geocode';

type UseReverseGeocodeParams = {
  latitude: number | null;
  longitude: number | null;
};

type ReverseGeocodeQueryData = {
  status: ReverseGeocodeResponse['status'];
  address: string | null;
};

export function useReverseGeocode({ latitude, longitude }: UseReverseGeocodeParams) {
  const isEnabled = latitude !== null && longitude !== null;

  return useQuery<FetchReverseGeocodeData, Error, ReverseGeocodeQueryData>({
    queryKey: ['reverse-geocode', latitude, longitude],
    queryFn: () =>
      fetchReverseGeocode({
        latitude: latitude!,
        longitude: longitude!,
      }),
    select: (data) => ({
      status: data.data.status,
      address: data.data.address,
    }),
    enabled: isEnabled,
    staleTime: 30 * 60 * 1000,
  });
}
