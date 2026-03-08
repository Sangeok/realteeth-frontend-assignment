import rawData from '@/public/korea_districts.json';
import { parseDistrict } from './parse-district';
import type { District } from './types';

const WHITESPACE_REGEX = /\s+/g;
const MAX_RESULTS = 20;

function parseRawDistricts(data: unknown): string[] {
  if (!Array.isArray(data)) {
    throw new Error('Invalid district dataset: expected an array.');
  }

  if (data.some((item) => typeof item !== 'string')) {
    throw new Error('Invalid district dataset: expected an array of strings.');
  }

  return data;
}

const rawStrings: string[] = parseRawDistricts(rawData);

const ALL_DISTRICTS: District[] = rawStrings.map(parseDistrict);

export function searchDistricts(query: string): District[] {
  const normalized = query.replace(WHITESPACE_REGEX, '');
  if (normalized.length === 0) return [];

  const results: District[] = [];

  for (const district of ALL_DISTRICTS) {
    const isMatch = district.searchTokens.some((token) => token.includes(normalized));

    if (isMatch) {
      results.push(district);
      if (results.length === MAX_RESULTS) break;
    }
  }

  return results;
}
