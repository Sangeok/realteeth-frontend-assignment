'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import {
  useFavoriteWeather,
  FavoriteAliasEditor,
  FavoriteWeatherSummary,
  type FavoriteItem,
} from '@/fsd/features/favorites';

type FavoriteWeatherCardProps = {
  item: FavoriteItem;
  onRemove: (id: string) => void;
  onUpdateAlias: (id: string, alias: string) => void;
};

export function FavoriteWeatherCard({ item, onRemove, onUpdateAlias }: FavoriteWeatherCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [aliasInput, setAliasInput] = useState('');

  const {
    displayName,
    districtDisplayName,
    districtHref,
    weatherState,
    currentTemperatureText,
    minimumTemperatureText,
    maximumTemperatureText,
  } = useFavoriteWeather(item);

  const handleEditAlias = () => {
    setAliasInput(displayName);
    setIsEditing(true);
  };

  const handleAliasSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdateAlias(item.id, aliasInput);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all hover:bg-white/50 dark:border-white/10 dark:bg-black/40 dark:hover:bg-black/50">
      {isEditing ? (
        <FavoriteAliasEditor
          districtDisplayName={districtDisplayName}
          aliasInput={aliasInput}
          onAliasInputChange={setAliasInput}
          onSubmit={handleAliasSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Link
          href={districtHref}
          className="flex flex-1 flex-col gap-3 p-4"
        >
          <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            {displayName}
          </p>
          <FavoriteWeatherSummary
            weatherState={weatherState}
            currentTemperatureText={currentTemperatureText}
            minimumTemperatureText={minimumTemperatureText}
            maximumTemperatureText={maximumTemperatureText}
          />
        </Link>
      )}

      <div className="flex items-center justify-between border-t border-white/20 px-4 py-2 dark:border-white/10">
        <button
          type="button"
          onClick={handleEditAlias}
          aria-label="별칭 수정"
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <Pencil className="h-3.5 w-3.5" />
          별칭 수정
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label="즐겨찾기 삭제"
          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          삭제
        </button>
      </div>
    </div>
  );
}
