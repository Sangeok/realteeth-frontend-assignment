import type { District } from '@/fsd/entities/district';

export type FavoriteItem = {
  id: string;
  district: District;
  alias: string | null;
};
