import { WeatherCard, type WeatherSummary } from '@/fsd/entities/weather';
import { HourlyTemperatureList } from './hourly-temperature-list';
import { CloudRain, Droplets, Sun } from 'lucide-react';

type WeatherSummarySectionProps = {
  summary: WeatherSummary;
};

export function WeatherSummarySection({ summary }: WeatherSummarySectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <WeatherCard
          label="현재 기온"
          value={summary.currentTemperature?.temperatureCelsius ? `${summary.currentTemperature.temperatureCelsius}°` : null}
          icon={<Sun className="h-5 w-5 text-amber-500" />}
        />
        <WeatherCard
          label="오늘 최저 기온"
          value={
            summary.forecast?.minimumTemperatureCelsius
              ? `${summary.forecast.minimumTemperatureCelsius}°`
              : null
          }
          icon={<Droplets className="h-5 w-5 text-blue-500" />}
        />
        <WeatherCard
          label="오늘 최고 기온"
          value={
            summary.forecast?.maximumTemperatureCelsius
              ? `${summary.forecast.maximumTemperatureCelsius}°`
              : null
          }
          icon={<CloudRain className="h-5 w-5 text-indigo-500" />}
        />
      </div>

      <HourlyTemperatureList temperatures={summary.forecast?.hourlyTemperatures ?? []} />
    </section>
  );
}
