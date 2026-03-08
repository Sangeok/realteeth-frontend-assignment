import { RefreshCw } from 'lucide-react';

type LoadingViewProps = {
  message: string;
};

export function LoadingView({ message }: LoadingViewProps) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">{message}</p>
      </div>
    </main>
  );
}
