'use client';

import type { District } from '@/fsd/entities/district';
import { usePlaceSearch } from '../model/hooks/use-place-search';
import { PlaceSearchInput } from './place-search-input';
import { PlaceSearchResults } from './place-search-results';

type PlaceSearchContainerProps = {
  onSelect: (district: District) => void;
};

export function PlaceSearchContainer({ onSelect }: PlaceSearchContainerProps) {
  const { query, results, isOpen, handleQueryChange, handleSelect, handleClose } =
    usePlaceSearch(onSelect);

  return (
    <div className="relative w-full">
      <PlaceSearchInput
        value={query}
        onChange={handleQueryChange}
        onEscape={handleClose}
      />

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={handleClose} />
          <div className="absolute z-20 mt-1 w-full">
            <PlaceSearchResults results={results} onSelect={handleSelect} />
          </div>
        </>
      )}
    </div>
  );
}

