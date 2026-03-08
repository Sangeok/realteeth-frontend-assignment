export function FavoriteCardSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-9 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="flex items-center gap-2">
        <div className="h-3 w-14 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-3 w-14 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
  );
}
