import { z } from 'zod';

export type HourlyTemperaturePoint = {
  forecastTime: string;
  temperatureCelsius: string;
};

export type ForecastSummary = {
  minimumTemperatureCelsius: string | null;
  maximumTemperatureCelsius: string | null;
  hourlyTemperatures: HourlyTemperaturePoint[];
};

const forecastItemSchema = z.object({
  baseDate: z.string(),
  baseTime: z.string(),
  category: z.string(),
  fcstDate: z.string(),
  fcstTime: z.string(),
  fcstValue: z.string(),
});

const forecastResponseSchema = z.object({
  response: z.object({
    body: z.object({
      items: z.object({
        item: z.array(forecastItemSchema),
      }),
    }),
  }),
});

type ForecastItem = z.infer<typeof forecastItemSchema>;
type ForecastCategory = 'TMP' | 'TMN' | 'TMX';

function getCurrentKstDate(): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return '';
  }

  return `${year}${month}${day}`;
}

function selectForecastDate(availableDates: string[]): string | null {
  if (availableDates.length === 0) {
    return null;
  }

  const currentKstDate = getCurrentKstDate();
  if (availableDates.includes(currentKstDate)) {
    return currentKstDate;
  }

  return [...availableDates].sort((left, right) => left.localeCompare(right))[0];
}

function toSortedTemperaturePoints(
  forecastItems: ForecastItem[],
  forecastDate: string,
): HourlyTemperaturePoint[] {
  const valuesByTime = new Map<string, string>();

  for (const item of forecastItems) {
    if (item.category !== 'TMP' || item.fcstDate !== forecastDate) {
      continue;
    }

    valuesByTime.set(item.fcstTime, item.fcstValue);
  }

  return Array.from(valuesByTime.entries())
    .sort(([leftTime], [rightTime]) => leftTime.localeCompare(rightTime))
    .map(([forecastTime, temperatureCelsius]) => ({
      forecastTime,
      temperatureCelsius,
    }));
}

function pickTemperatureValue(
  forecastItems: ForecastItem[],
  category: ForecastCategory,
  forecastDate: string,
): string | null {
  const exactMatchItem = forecastItems.find(
    (item) => item.category === category && item.fcstDate === forecastDate,
  );
  if (exactMatchItem) {
    return exactMatchItem.fcstValue;
  }

  const fallbackItem = forecastItems.find((item) => item.category === category);
  return fallbackItem ? fallbackItem.fcstValue : null;
}

function extractForecastItems(payload: unknown): ForecastItem[] | null {
  const parsedResponse = forecastResponseSchema.safeParse(payload);
  if (!parsedResponse.success) {
    return null;
  }

  const forecastItems = parsedResponse.data.response.body.items.item;
  return forecastItems.length > 0 ? forecastItems : null;
}

export function parseForecastSummary(payload: unknown): ForecastSummary | null {
  const forecastItems = extractForecastItems(payload);
  if (!forecastItems) {
    return null;
  }

  const availableDates = Array.from(new Set(forecastItems.map((item) => item.fcstDate)));
  const forecastDate = selectForecastDate(availableDates);

  if (!forecastDate) {
    return null;
  }

  return {
    minimumTemperatureCelsius: pickTemperatureValue(forecastItems, 'TMN', forecastDate),
    maximumTemperatureCelsius: pickTemperatureValue(forecastItems, 'TMX', forecastDate),
    hourlyTemperatures: toSortedTemperaturePoints(forecastItems, forecastDate),
  };
}
