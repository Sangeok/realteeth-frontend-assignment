'use client';

import { PlaceSearchContainer } from '@/fsd/features/place-search';
import { FavoriteSection } from '@/fsd/widgets/favorite-section';
import { LocationHeader } from '@/fsd/widgets/location-header';
import { WeatherDashboard } from '@/fsd/widgets/weather-dashboard';
import { useHomePage } from '../model/use-home-page';

export function HomePage() {
  const {
    selectedDistrict,
    favorites,
    locationState,
    requestLocation,
    addFavorite,
    removeFavorite,
    updateAlias,
    handleSelectDistrict,
    handleSwitchToCurrentLocation,
  } = useHomePage();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 p-4 py-12 sm:p-8">
      <LocationHeader
        locationState={locationState}
        requestLocation={requestLocation}
        selectedDistrict={selectedDistrict}
        onSwitchToCurrentLocation={handleSwitchToCurrentLocation}
      />

      <section className="relative z-30 w-full">
        <PlaceSearchContainer onSelect={handleSelectDistrict} />
      </section>

      <WeatherDashboard
        favorites={favorites}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
        selectedDistrict={selectedDistrict}
        locationState={locationState}
        onSwitchToCurrentLocation={handleSwitchToCurrentLocation}
      />

      <FavoriteSection
        favorites={favorites}
        removeFavorite={removeFavorite}
        updateAlias={updateAlias}
      />
    </main>
  );
}
