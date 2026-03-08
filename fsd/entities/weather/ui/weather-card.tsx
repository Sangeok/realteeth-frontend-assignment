type WeatherCardProps = {
  label: string;
  value: string | null;
  icon: React.ReactNode;
};

export function WeatherCard({ label, value, icon }: WeatherCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/20 bg-white/40 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all hover:bg-white/50 dark:border-white/10 dark:bg-black/40 dark:hover:bg-black/50">
      <div className="mb-2 flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
        {icon}
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
        {value ?? '-'}
      </p>
    </div>
  );
}
