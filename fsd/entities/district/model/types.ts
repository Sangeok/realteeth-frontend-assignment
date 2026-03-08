export type DistrictLevel = 'city' | 'gu' | 'dong';

export type District = {
  raw: string;
  level: DistrictLevel;
  displayName: string;
  searchTokens: string[];
};

export type DistrictGrid = {
  nx: number;
  ny: number;
};
