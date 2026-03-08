'use client';

import { Check, X } from 'lucide-react';
import type { FormEvent } from 'react';

const ALIAS_MAX_LENGTH = 20;

type FavoriteAliasEditorProps = {
  districtDisplayName: string;
  aliasInput: string;
  onAliasInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function FavoriteAliasEditor({
  districtDisplayName,
  aliasInput,
  onAliasInputChange,
  onSubmit,
  onCancel,
}: FavoriteAliasEditorProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
        {districtDisplayName}
      </p>
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={aliasInput}
          onChange={(event) => onAliasInputChange(event.target.value)}
          className="flex-1 rounded-lg border border-white/30 bg-white/60 px-3 py-1.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-indigo-400/50 dark:border-white/20 dark:bg-black/50 dark:text-neutral-100"
          autoFocus
          maxLength={ALIAS_MAX_LENGTH}
          placeholder="별칭 입력..."
        />
        <button
          type="submit"
          aria-label="별칭 저장"
          className="rounded-lg p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onCancel}
          aria-label="별칭 수정 취소"
          className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
