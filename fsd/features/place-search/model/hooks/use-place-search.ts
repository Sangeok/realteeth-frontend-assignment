'use client';

import type { District } from '@/fsd/entities/district';
import { searchDistricts } from '@/fsd/entities/district';
import { useDebounce } from '@/fsd/shared/model/hooks/use-debounce';
import { useCallback, useMemo, useState } from 'react';

const DEBOUNCE_MS = 300;

type UsePlaceSearchReturn = {
  query: string;
  results: District[];
  isOpen: boolean;
  handleQueryChange: (value: string) => void;
  handleSelect: (district: District) => void;
  handleClose: () => void;
};

export function usePlaceSearch(
  onSelect: (district: District) => void
): UsePlaceSearchReturn {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const results = useMemo(() => searchDistricts(debouncedQuery), [debouncedQuery]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setIsOpen(value.trim().length > 0);
  }, []);

  const handleSelect = useCallback(
    (district: District) => {
      setQuery(district.displayName);
      setIsOpen(false);
      onSelect(district);
    },
    [onSelect]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    query,
    results,
    isOpen,
    handleQueryChange,
    handleSelect,
    handleClose,
  };
}

