import {
  extractCurrentTemperature,
  type CurrentTemperatureType,
} from './parse-current-temperature';
import {
  parseForecastSummary,
  type ForecastSummary,
} from './parse-forecast-summary';

type JsonRecord = Record<string, unknown>;

export type WeatherSummary = {
  currentTemperature: CurrentTemperatureType | null;
  forecast: ForecastSummary | null;
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}

export function parseWeatherSummary(payload: unknown): WeatherSummary | null {
  if (!isRecord(payload)) {
    return null;
  }

  const currentTemperature = extractCurrentTemperature(payload.nowcast);

  const forecast = parseForecastSummary(payload.forecast);

  if (!currentTemperature && !forecast) {
    return null;
  }

  return {
    currentTemperature,
    forecast,
  };
}
