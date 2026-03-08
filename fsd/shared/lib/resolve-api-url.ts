function getServerOrigin(): string {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    process.env.VERCEL_URL;

  if (configuredOrigin) {
    if (
      configuredOrigin.startsWith('http://') ||
      configuredOrigin.startsWith('https://')
    ) {
      return configuredOrigin;
    }

    return `https://${configuredOrigin}`;
  }

  return `http://127.0.0.1:${process.env.PORT ?? '3000'}`;
}

export function resolveApiUrl(path: string): string {
  if (typeof window !== 'undefined') {
    return path;
  }

  return new URL(path, getServerOrigin()).toString();
}
