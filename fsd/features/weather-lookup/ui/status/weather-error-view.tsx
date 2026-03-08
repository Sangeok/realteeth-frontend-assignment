type WeatherErrorViewProps = {
  message?: string;
};

export function WeatherErrorView({ message }: WeatherErrorViewProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400">
      <h3 className="font-semibold">날씨 정보를 불러오지 못했습니다.</h3>
      <p className="mt-1 text-sm opacity-90">
        {message ?? '잠시 후 다시 시도해 주세요.'}
      </p>
    </div>
  );
}
