'use client';

import type { District } from '@/fsd/entities/district';
import {
  type FavoriteItem,
  useFavorites,
} from '@/fsd/features/favorites';
import {
  type LocationState,
  useCurrentLocation,
} from '@/fsd/features/current-location';
import { useEffect, useState } from 'react';

type UseHomePageResult = {
  selectedDistrict: District | null;
  favorites: FavoriteItem[];
  locationState: LocationState;
  requestLocation: () => void;
  addFavorite: (district: District) => void;
  removeFavorite: (id: string) => void;
  updateAlias: (id: string, alias: string) => void;
  handleSelectDistrict: (district: District) => void;
  handleSwitchToCurrentLocation: () => void;
};

export function useHomePage(): UseHomePageResult {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const { locationState, requestLocation } = useCurrentLocation();
  const { favorites, addFavorite, removeFavorite, updateAlias } =
    useFavorites();

  useEffect(() => {
    useFavorites.persist.rehydrate();
  }, []);

  const handleSelectDistrict = (district: District) => {
    setSelectedDistrict(district);
  };

  const handleSwitchToCurrentLocation = () => {
    setSelectedDistrict(null);
    requestLocation();
  };

  return {
    selectedDistrict,
    favorites,
    locationState,
    requestLocation,
    addFavorite,
    removeFavorite,
    updateAlias,
    handleSelectDistrict,
    handleSwitchToCurrentLocation,
  };
}
