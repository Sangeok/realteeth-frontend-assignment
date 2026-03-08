import { getWeatherUpstreamBaseDateTime } from './get-weather-upstream-base-date-time';
import type { WeatherRequestParams } from './parse-weather-request';

type WeatherUpstreamPayload = {
  forecast: unknown;
  nowcast: unknown;
};

type FetchWeatherUpstreamSuccess = {
  ok: true;
  data: WeatherUpstreamPayload;
};

type FetchWeatherUpstreamFailure = {
  ok: false;
  errorBody: Record<string, unknown>;
};

type FetchSourceResult =
  | {
      ok: true;
      data: unknown;
    }
  | {
      ok: false;
      source: 'forecast' | 'nowcast';
      upstreamStatus: number | null;
      error: string;
    };

export type FetchWeatherUpstreamResult =
  | FetchWeatherUpstreamSuccess
  | FetchWeatherUpstreamFailure;

export async function fetchWeatherUpstream(
  params: WeatherRequestParams,
): Promise<FetchWeatherUpstreamResult> {
  const serviceKey = process.env.WEATHER_DATA_API_KEY;
  const forecastApiUrl =
    process.env.WEATHER_DATA_FORECAST_BASE_URL ?? process.env.WEATHER_DATA_BASE_URL;
  const nowcastApiUrl = process.env.WEATHER_DATA_NOWCAST_BASE_URL;

  if (!forecastApiUrl) {
    throw new Error(
      'Missing WEATHER_DATA_FORECAST_BASE_URL (or WEATHER_DATA_BASE_URL) in server environment.',
    );
  }

  if (!nowcastApiUrl) {
    throw new Error('Missing WEATHER_DATA_NOWCAST_BASE_URL in server environment.');
  }

  if (!serviceKey) {
    throw new Error('Missing WEATHER_DATA_API_KEY in server environment.');
  }

  const baseDateTime = getWeatherUpstreamBaseDateTime();
  const forecastFetchUrl = buildWeatherApiUrl({
    apiUrl: forecastApiUrl,
    serviceKey,
    baseDate: baseDateTime.forecastBaseDate,
    baseTime: baseDateTime.forecastBaseTime,
    nx: params.nx,
    ny: params.ny,
  });
  const nowcastFetchUrl = buildWeatherApiUrl({
    apiUrl: nowcastApiUrl,
    serviceKey,
    baseDate: baseDateTime.nowcastBaseDate,
    baseTime: baseDateTime.nowcastBaseTime,
    nx: params.nx,
    ny: params.ny,
  });

  const [forecastResult, nowcastResult] = await Promise.all([
    fetchSource('forecast', forecastFetchUrl),
    fetchSource('nowcast', nowcastFetchUrl),
  ]);

  if (!forecastResult.ok || !nowcastResult.ok) {
    return {
      ok: false,
      errorBody: {
        error: 'Weather upstream returned an error.',
        forecastError: forecastResult.ok
          ? null
          : {
              source: forecastResult.source,
              upstreamStatus: forecastResult.upstreamStatus,
              message: forecastResult.error,
            },
        nowcastError: nowcastResult.ok
          ? null
          : {
              source: nowcastResult.source,
              upstreamStatus: nowcastResult.upstreamStatus,
              message: nowcastResult.error,
            },
      },
    };
  }

  return {
    ok: true,
    data: {
      forecast: forecastResult.data,
      nowcast: nowcastResult.data,
    },
  };
}

type BuildWeatherApiUrlParams = {
  apiUrl: string;
  serviceKey: string;
  baseDate: string;
  baseTime: string;
  nx: string;
  ny: string;
};

function buildWeatherApiUrl({
  apiUrl,
  serviceKey,
  baseDate,
  baseTime,
  nx,
  ny,
}: BuildWeatherApiUrlParams): string {
  const queryParams = new URLSearchParams({
    pageNo: '1',
    numOfRows: '1000',
    dataType: 'JSON',
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
  });

  return `${apiUrl}?serviceKey=${serviceKey}&${queryParams.toString()}`;
}

async function fetchSource(
  source: 'forecast' | 'nowcast',
  fetchUrl: string,
): Promise<FetchSourceResult> {
  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      return {
        ok: false,
        source,
        upstreamStatus: response.status,
        error: `${source} upstream returned an error.`,
      };
    }

    const data: unknown = await response.json();
    return { ok: true, data };
  } catch (error) {
    console.error(`Weather ${source} API Fetch Error:`, error);
    return {
      ok: false,
      source,
      upstreamStatus: null,
      error: `Failed to fetch ${source} weather data from upstream API.`,
    };
  }
}
