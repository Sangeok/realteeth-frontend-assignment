import { z } from 'zod';

const weatherItemSchema = z.object({
  category: z.string(),
  obsrValue: z.string(),
});

const nowcastResponseSchema = z.object({
  response: z.object({
    body: z.object({
      items: z.object({
        item: z.array(weatherItemSchema),
      }),
    }),
  }),
});

type NowcastResponse = z.infer<typeof nowcastResponseSchema>;

export type CurrentTemperatureType = {
  temperatureCelsius: string | null;
};

export function parseNowcastResponse(payload: unknown): NowcastResponse | null {
  const result = nowcastResponseSchema.safeParse(payload);
  return result.success ? result.data : null;
}

export function extractCurrentTemperature(
  payload: unknown
): CurrentTemperatureType | null {
  const parsedResponse = parseNowcastResponse(payload);
  if (!parsedResponse) {
    return null;
  }

  const nowcastItems = parsedResponse.response.body.items.item;
  if (nowcastItems.length === 0) {
    return null;
  }

  const temperatureItem = nowcastItems.find((item) => item.category === 'T1H');

  return {
    temperatureCelsius: temperatureItem?.obsrValue ?? null,
  };
}
