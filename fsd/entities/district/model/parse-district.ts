import type { District } from './types';

export function parseDistrict(raw: string): District {
  const parts = raw.split('-');

  const level = parts.length === 1 ? 'city' : parts.length === 2 ? 'gu' : 'dong';
  const displayName = parts.join(' ');
  
  const searchTokens = [...parts, parts.join('')]

  return {
    raw,
    level,
    displayName,
    searchTokens,
  };
}
