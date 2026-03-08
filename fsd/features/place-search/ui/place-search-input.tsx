import { Search } from 'lucide-react';
import type { KeyboardEvent } from 'react';

type PlaceSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onEscape?: () => void;
};

export function PlaceSearchInput({
  value,
  onChange,
  onEscape,
}: PlaceSearchInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onEscape?.();
    }
  };

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="시도·구·동 이름으로 검색 (예: 종로구, 청운동)"
        className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-white/10 dark:bg-neutral-900 dark:text-white"
      />
    </div>
  );
}

