import { z } from 'zod';

import { API_ROUTES } from '@/fsd/shared/config';
import { buildQueryString, resolveApiUrl } from '@/fsd/shared/lib';
import { parseApiError } from '../parse-api-error';

const reverseGeocodeResponseSchema = z.object({
  status: z.enum(['OK', 'NOT_FOUND']),
  address: z.string().nullable(),
});

export type ReverseGeocodeResponse = z.infer<typeof reverseGeocodeResponseSchema>;

type FetchReverseGeocodeParams = {
  latitude: number;
  longitude: number;
};

export type FetchReverseGeocodeData = {
  data: ReverseGeocodeResponse;
};

export async function fetchReverseGeocode(
  params: FetchReverseGeocodeParams,
): Promise<FetchReverseGeocodeData> {
  const response = await fetch(
    resolveApiUrl(
      `${API_ROUTES.GEOCODER}?${buildQueryString({
        latitude: String(params.latitude),
        longitude: String(params.longitude),
      })}`,
    ),
  );
  const data: unknown = await response.json();

  if (!response.ok) {
    throw new Error(parseApiError(data, 'Geocoder API request failed.'));
  }

  const parsed = reverseGeocodeResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Unexpected geocoder response format.');
  }

  return {
    data: parsed.data,
  };
}
