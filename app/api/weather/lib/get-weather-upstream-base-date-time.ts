export type WeatherUpstreamBaseDateTime = {
  forecastBaseDate: string;
  forecastBaseTime: string;
  nowcastBaseDate: string;
  nowcastBaseTime: string;
};

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const FORECAST_BASE_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];
const FORECAST_RELEASE_MINUTE = 10;
const NOWCAST_RELEASE_MINUTE = 40;

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

function formatTime(date: Date): string {
  const hour = String(date.getUTCHours()).padStart(2, '0');
  return `${hour}00`;
}

export function getWeatherUpstreamBaseDateTime(now = new Date()): WeatherUpstreamBaseDateTime {
  const kstNow = new Date(now.getTime() + KST_OFFSET_MS);

  const forecastBaseDateTime = new Date(kstNow);
  const selectedForecastBaseHour = [...FORECAST_BASE_HOURS]
    .reverse()
    .find(
      (hour) =>
        kstNow.getUTCHours() > hour ||
        (kstNow.getUTCHours() === hour && kstNow.getUTCMinutes() >= FORECAST_RELEASE_MINUTE),
    );

  if (selectedForecastBaseHour === undefined) {
    forecastBaseDateTime.setUTCDate(forecastBaseDateTime.getUTCDate() - 1);
    forecastBaseDateTime.setUTCHours(23, 0, 0, 0);
  } else {
    forecastBaseDateTime.setUTCHours(selectedForecastBaseHour, 0, 0, 0);
  }

  const nowcastBaseDateTime = new Date(kstNow);
  if (nowcastBaseDateTime.getUTCMinutes() < NOWCAST_RELEASE_MINUTE) {
    nowcastBaseDateTime.setUTCHours(nowcastBaseDateTime.getUTCHours() - 1);
  }
  nowcastBaseDateTime.setUTCMinutes(0, 0, 0);

  return {
    forecastBaseDate: formatDate(forecastBaseDateTime),
    forecastBaseTime: formatTime(forecastBaseDateTime),
    nowcastBaseDate: formatDate(nowcastBaseDateTime),
    nowcastBaseTime: formatTime(nowcastBaseDateTime),
  };
}
