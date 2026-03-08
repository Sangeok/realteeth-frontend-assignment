import type { District } from '@/fsd/entities/district';

const DISTRICT_LEVEL_LABEL: Record<District['level'], string> = {
  city: '시도',
  gu: '구·군',
  dong: '동·읍·면',
};

type PlaceSearchResultsProps = {
  results: District[];
  onSelect: (district: District) => void;
};

export function PlaceSearchResults({ results, onSelect }: PlaceSearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500 shadow-lg dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <ul
      role="listbox"
      className="max-h-64 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-white/10 dark:bg-neutral-900"
    >
      {results.map((district) => (
        <li key={district.raw}>
          <button
            role="option"
            aria-selected="false"
            type="button"
            onClick={() => onSelect(district)}
            className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/60"
          >
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              {district.displayName}
            </span>
            <span className="ml-2 text-xs text-neutral-400">
              {DISTRICT_LEVEL_LABEL[district.level]}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
