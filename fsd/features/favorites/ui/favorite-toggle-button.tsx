'use client';

import { Star } from 'lucide-react';
import { MAX_FAVORITES } from '../config';

type FavoriteToggleButtonProps = {
  isFavorited: boolean;
  isFull: boolean;
  onAdd: () => void;
  onRemove: () => void;
};

export function FavoriteToggleButton({
  isFavorited,
  isFull,
  onAdd,
  onRemove,
}: FavoriteToggleButtonProps) {
  if (isFavorited) {
    return (
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50/60 px-4 py-1.5 text-sm font-medium text-amber-700 backdrop-blur-md hover:bg-amber-100/60 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-400"
      >
        <Star className="h-4 w-4 fill-current" />
        즐겨찾기 해제
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={isFull}
      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/50 px-4 py-1.5 text-sm font-medium text-neutral-700 backdrop-blur-md hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-black/40 dark:text-neutral-300"
    >
      <Star className="h-4 w-4" />
      {isFull ? `즐겨찾기 가득 참 (최대 ${MAX_FAVORITES}개)` : '즐겨찾기에 추가'}
    </button>
  );
}
