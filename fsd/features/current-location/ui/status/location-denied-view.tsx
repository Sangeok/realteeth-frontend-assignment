import { Map, RefreshCw } from 'lucide-react';

type LocationDeniedViewProps = {
  onRetry: () => void;
};

export function LocationDeniedView({ onRetry }: LocationDeniedViewProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-white/20 bg-white/40 p-8 text-center shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/40">
        <Map className="h-12 w-12 text-neutral-400" />
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">위치 정보 접근 권한 거부됨</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          현재 위치의 날씨 정보를 확인하려면 위치 정보가 필요합니다. 기기 설정에서 위치 서비스를 허용해 주세요.
        </p>
        <button
          onClick={onRetry}
          className="mt-2 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </button>
      </div>
    </main>
  );
}
