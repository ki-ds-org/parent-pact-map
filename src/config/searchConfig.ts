export const SWEDEN_BOUNDS = {
  south: 55.337,
  west: 10.87,
  north: 69.06,
  east: 24.17,
} as const;

export const MIN_QUERY_LENGTH = 3;
export const MAX_QUERY_LENGTH = 200;
export const MAX_AUTOCOMPLETE_QUERY_LENGTH = MAX_QUERY_LENGTH + " kommun".length;
export const DEBOUNCE_DELAY = 1000;