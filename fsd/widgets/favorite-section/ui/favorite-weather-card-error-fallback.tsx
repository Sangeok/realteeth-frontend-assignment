export function FavoriteWeatherCardErrorFallback() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-red-200/50 bg-red-50/30 dark:border-red-900/30 dark:bg-red-950/30">
      <div className="flex flex-1 flex-col justify-center gap-2 p-4">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          날씨 정보를 불러오지 못했습니다.
        </p>
        <p className="text-xs text-red-500 dark:text-red-300">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
      <div className="border-t border-red-200/50 px-4 py-2 dark:border-red-900/30">
        <span className="text-xs text-red-500 dark:text-red-300">
          카드 오류
        </span>
      </div>
    </div>
  );
}
