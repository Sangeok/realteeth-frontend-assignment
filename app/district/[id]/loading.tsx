import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-8">
      <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/40 px-4 py-3 text-sm text-neutral-600 backdrop-blur-md dark:border-white/10 dark:bg-black/40 dark:text-neutral-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        지역 날씨를 불러오는 중...
      </div>
    </main>
  );
}
