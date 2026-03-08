import { lookupDistrictGrid, type District } from '@/fsd/entities/district';
import type { UseWeatherQueryParams } from '@/fsd/entities/weather';
import type { CurrentLocation } from '@/fsd/features/current-location';

export function resolveWeatherParams(
  selectedDistrict: District | null,
  location: CurrentLocation | null,
): UseWeatherQueryParams {
  if (selectedDistrict) {
    const districtGrid = lookupDistrictGrid(selectedDistrict.raw);

    if (districtGrid) {
      return { nx: districtGrid.nx, ny: districtGrid.ny };
    }

    return { latitude: null, longitude: null };
  }

  if (location) {
    return { latitude: location.latitude, longitude: location.longitude };
  }

  return { latitude: null, longitude: null };
}
