export function buildQueryString(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}
