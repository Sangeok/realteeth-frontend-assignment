import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-white/20 bg-white/40 p-8 text-center backdrop-blur-md dark:border-white/10 dark:bg-black/40">
        <p className="text-5xl font-extrabold text-neutral-300 dark:text-neutral-600">
          404
        </p>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            페이지를 찾을 수 없습니다.
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-neutral-800 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
