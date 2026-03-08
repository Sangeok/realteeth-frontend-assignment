function WeatherCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-white/20 bg-white/40 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-black/40">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-5 w-5 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="h-8 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
}

function HourlyTemperatureListSkeleton() {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-black/40">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-5 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-5 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="flex w-full gap-4 overflow-x-hidden pb-4 pt-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex min-w-[5rem] flex-col items-center gap-2 rounded-xl bg-white/50 p-3 dark:bg-black/50"
          >
            <div className="h-4 w-10 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-6 w-8 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeatherDashboardSkeleton() {
  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <WeatherCardSkeleton />
        <WeatherCardSkeleton />
        <WeatherCardSkeleton />
      </div>
      <HourlyTemperatureListSkeleton />
    </section>
  );
}
