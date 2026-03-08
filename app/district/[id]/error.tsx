'use client';

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const debugMessage =
    process.env.NODE_ENV === 'development' ? error.message : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400">
        <h1 className="text-lg font-semibold">지역 날씨를 불러오지 못했습니다.</h1>
        <p className="text-sm opacity-90">잠시 후 다시 시도해 주세요.</p>
        {debugMessage ? (
          <p className="text-xs opacity-80">{debugMessage}</p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}
