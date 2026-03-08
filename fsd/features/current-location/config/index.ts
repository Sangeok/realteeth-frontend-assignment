const GEOLOCATION_TIMEOUT_MS = 10_000;
const GEOLOCATION_MAX_AGE_MS = 300_000;

export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: GEOLOCATION_TIMEOUT_MS,
  maximumAge: GEOLOCATION_MAX_AGE_MS,
};