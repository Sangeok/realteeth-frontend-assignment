import type { GeocoderRequestParams } from './validate-geocoder-request';

import { z } from 'zod';

type JsonRecord = Record<string, unknown>;

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

const VworldUpstreamSchema = z.object({
  response: z.object({
    status: z.string().optional(),
    error: z.object({
      text: z.string().optional(),
    }).optional(),
    result: z.unknown().optional(),
  }),
});

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}

function readNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function readAddressText(value: unknown): string | null {
  if (typeof value === 'string') {
    return readNonEmptyString(value);
  }

  if (!isRecord(value)) {
    return null;
  }

  const textLikeKeys = ['text', 'address', 'fullAddress', 'roadAddress', 'parcelAddress'] as const;

  for (const key of textLikeKeys) {
    const text = readNonEmptyString(value[key]);
    if (text) {
      return text;
    }
  }

  return null;
}

function readNestedAddress(record: JsonRecord, key: 'road' | 'parcel'): string | null {
  const nested = record[key];

  if (typeof nested === 'string') {
    return readNonEmptyString(nested);
  }

  return readAddressText(nested);
}

function extractAddressesFromResult(rawResult: unknown): {
  address: string | null;
} {
  const items = Array.isArray(rawResult) ? rawResult : rawResult ? [rawResult] : [];
  const candidateTexts: string[] = [];
  let roadAddress: string | null = null;
  let parcelAddress: string | null = null;

  for (const item of items) {
    if (!isRecord(item)) {
      continue;
    }

    const itemType = readNonEmptyString(item.type)?.toUpperCase();
    const text = readAddressText(item);

    if (itemType === 'ROAD' && text && !roadAddress) {
      roadAddress = text;
    }

    if (itemType === 'PARCEL' && text && !parcelAddress) {
      parcelAddress = text;
    }

    if (!roadAddress) {
      roadAddress = readNestedAddress(item, 'road');
    }

    if (!parcelAddress) {
      parcelAddress = readNestedAddress(item, 'parcel');
    }

    if (text) {
      candidateTexts.push(text);
    }
  }

  const address = roadAddress ?? parcelAddress ?? candidateTexts[0] ?? null;

  return {
    address,
  };
}

function parseGeocoderPayload(payload: unknown): {
  success: true;
  data: ReverseGeocodeData;
} | {
  success: false;
  error: string;
} {
  const schemaResult = VworldUpstreamSchema.safeParse(payload);

  if (!schemaResult.success) {
    return { success: false, error: 'Invalid geocoder response format.' };
  }

  const { response } = schemaResult.data;
  const statusValue = response.status;
  const normalizedStatus = statusValue ? statusValue.toUpperCase() : null;

  if (normalizedStatus === 'ERROR') {
    return {
      success: false,
      error: response.error?.text || 'Geocoder upstream returned an error.'
    };
  }

  if (normalizedStatus !== 'OK' && normalizedStatus !== 'NOT_FOUND') {
    return { success: false, error: 'Unexpected geocoder response status.' };
  }

  const { address } = extractAddressesFromResult(response.result);

  return {
    success: true,
    data: {
      status: normalizedStatus as 'OK' | 'NOT_FOUND',
      address,
    },
  };
}

function buildGeocoderUrl(
  params: GeocoderRequestParams,
  apiKey: string,
): string {
  const queryParams = new URLSearchParams({
    service: 'address',
    request: 'getAddress',
    version: '2.0',
    crs: 'EPSG:4326',
    point: `${params.longitude},${params.latitude}`,
    format: 'json',
    errorFormat: 'json',
    type: 'BOTH',
    zipcode: 'false',
    simple: 'true',
    key: apiKey,
  });

  return `${process.env.VWORLD_GEOCODER_BASE_URL}?${queryParams.toString()}`;
}

export async function fetchGeocoderUpstream(
  params: GeocoderRequestParams,
): Promise<FetchGeocoderUpstreamResult> {
  const apiKey = process.env.GEOCODER_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEOCODER_API_KEY in server environment.');
  }

  const fetchUrl = buildGeocoderUrl(params, apiKey);

  try {
    const response = await fetch(fetchUrl, {
      signal: AbortSignal.timeout(5000),
      headers: process.env.NEXT_PUBLIC_PRODUCTION_URL
        ? { Referer: process.env.NEXT_PUBLIC_PRODUCTION_URL }
        : undefined,
    });

    if (!response.ok) {
      return {
        success: false,
        errorBody: {
          error: 'Geocoder upstream returned an error.',
          upstreamStatus: response.status,
        },
      };
    }

    const data: unknown = await response.json();
    const parsedPayload = parseGeocoderPayload(data);

    if (!parsedPayload.success) {
      return {
        success: false,
        errorBody: {
          error: parsedPayload.error,
        },
      };
    }

    return {
      success: true,
      data: parsedPayload.data,
    };
  } catch (error) {
    console.error('Geocoder API Fetch Error:', error);
    return {
      success: false,
      errorBody: { error: 'Failed to fetch geocoder data from upstream API.' },
    };
  }
}
