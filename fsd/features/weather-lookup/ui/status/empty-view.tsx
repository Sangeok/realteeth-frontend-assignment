type EmptyViewProps = {
  message?: string;
};

export function EmptyView({
  message = '이 위치의 날씨 정보를 찾을 수 없습니다.',
}: EmptyViewProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/40 p-8 text-center backdrop-blur-md dark:border-white/10 dark:bg-black/40">
      <p className="text-neutral-600 dark:text-neutral-400">{message}</p>
    </div>
  );
}
