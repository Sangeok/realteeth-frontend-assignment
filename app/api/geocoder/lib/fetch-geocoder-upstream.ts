import type { GeocoderRequestParams } from './validate-geocoder-request';

import { z } from 'zod';

export type ReverseGeocodeData = {
  status: 'OK' | 'NOT_FOUND';
  address: string | null;
};

type FetchGeocoderUpstreamSuccess = {
  success: true;
  data: ReverseGeocodeData;
};

type FetchGeocoderUpstreamFailure = {
  success: false;
  errorBody: Record<string, unknown>;
};

export type FetchGeocoderUpstreamResult =
  | FetchGeocoderUpstreamSuccess
  | FetchGeocoderUpstreamFailure;

const KakaoCoord2AddressSchema = z.object({
  meta: z.object({
    total_count: z.number(),
  }),
  documents: z.array(
    z.object({
      road_address: z
        .object({ address_name: z.string() })
        .nullable(),
      address: z
        .object({ address_name: z.string() })
        .nullable(),
    }),
  ),
});

function buildKakaoUrl(params: GeocoderRequestParams): string {
  const query = new URLSearchParams({
    x: String(params.longitude),
    y: String(params.latitude),
    input_coord: 'WGS84',
  });
  return `${process.env.KAKAO_GEOCODER_BASE_URL}?${query.toString()}`;
}

export async function fetchGeocoderUpstream(
  params: GeocoderRequestParams,
): Promise<FetchGeocoderUpstreamResult> {
  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    throw new Error('Missing KAKAO_REST_API_KEY in server environment.');
  }

  try {
    const response = await fetch(buildKakaoUrl(params), {
      signal: AbortSignal.timeout(5000),
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        errorBody: {
          error: 'Kakao geocoder upstream returned an error.',
          upstreamStatus: response.status,
        },
      };
    }

    const raw: unknown = await response.json();
    const parsed = KakaoCoord2AddressSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        errorBody: { error: 'Unexpected Kakao geocoder response format.' },
      };
    }

    if (parsed.data.meta.total_count === 0) {
      return {
        success: true,
        data: { status: 'NOT_FOUND', address: null },
      };
    }

    const doc = parsed.data.documents[0];
    const address =
      doc.road_address?.address_name ??
      doc.address?.address_name ??
      null;

    return {
      success: true,
      data: { status: 'OK', address },
    };
  } catch (error) {
    console.error('Kakao Geocoder API Fetch Error:', error);
    return {
      success: false,
      errorBody: { error: 'Failed to fetch geocoder data from Kakao API.' },
    };
  }
}
