import { API_ROUTES } from '@/fsd/shared/config';
import { buildQueryString, resolveApiUrl } from '@/fsd/shared/lib';

type FetchWeatherParams = {
  nx: string;
  ny: string;
};

export type FetchWeatherData = {
  statusCode: number;
  data: unknown;
};

export async function fetchWeather(params: FetchWeatherParams): Promise<FetchWeatherData> {
  const response = await fetch(
    resolveApiUrl(`${API_ROUTES.WEATHER}?${buildQueryString(params)}`),
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Weather API request failed. Check the upstream response.');
  }

  return { statusCode: response.status, data };
}
