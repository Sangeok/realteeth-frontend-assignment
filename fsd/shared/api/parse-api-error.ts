import { z } from 'zod';

const errorResponseSchema = z.object({ error: z.string() });

export function parseApiError(data: unknown, fallbackMessage: string): string {
  const result = errorResponseSchema.safeParse(data);
  return result.success ? result.data.error : fallbackMessage;
}
