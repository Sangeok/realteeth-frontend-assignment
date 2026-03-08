import { type HourlyTemperaturePoint } from '@/fsd/entities/weather';
import { formatTimeString } from '@/fsd/shared/lib';
import { Cloud } from 'lucide-react';

type HourlyTemperatureListProps = {
  temperatures: HourlyTemperaturePoint[];
};

export function HourlyTemperatureList({ temperatures }: HourlyTemperatureListProps) {
  const isEmpty = temperatures.length === 0;

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/40 p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-black/40">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          오늘 시간대별 기온 정보가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-black/40">
      <div className="mb-4 flex items-center gap-2">
        <Cloud className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          시간대별 예보
        </h2>
      </div>
      <div className="flex w-full gap-4 overflow-x-auto pb-4 pt-2 snap-x">
        {temperatures.map((point) => (
          <div
            key={point.forecastTime}
            className="flex min-w-[5rem] snap-start flex-col items-center justify-center gap-2 rounded-xl bg-white/50 p-3 shadow-sm dark:bg-black/50"
          >
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              {formatTimeString(point.forecastTime)}
            </span>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              {point.temperatureCelsius}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
