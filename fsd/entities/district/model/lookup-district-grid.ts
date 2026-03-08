import gridData from '@/public/district_grid.json';
import type { DistrictGrid } from './types';

const GRID_MAP: Record<string, DistrictGrid> = gridData;

export function lookupDistrictGrid(raw: string): DistrictGrid | null {
  const normalizedRaw = raw.trim();
  if (normalizedRaw.length === 0) return null;

  const parts = normalizedRaw.split('-');
  const guKey = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : null;
  const cityKey = parts[0] ?? null;
  const candidateKeys = [normalizedRaw, guKey, cityKey];

  for (const key of candidateKeys) {
    if (key == null) continue;
    const grid = GRID_MAP[key];
    if (grid != null) return grid;
  }

  return null;
}
