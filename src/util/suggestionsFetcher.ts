import {
  MAX_AUTOCOMPLETE_QUERY_LENGTH,
  SWEDEN_BOUNDS,
} from "../config/searchConfig";
import type { Suggestion } from "../types/SearchTypes";

export const fetchSuggestions = async (
  query: string,
  sessionToken?: google.maps.places.AutocompleteSessionToken
): Promise<Suggestion[]> => {
  const input = query.trim();
  if (!input || input.length > MAX_AUTOCOMPLETE_QUERY_LENGTH) {
    throw new Error(
      `Autocomplete query must be between 1 and ${MAX_AUTOCOMPLETE_QUERY_LENGTH} characters`
    );
  }

  const req = {
    input,
    includedRegionCodes: ["SE"],
    locationRestriction: SWEDEN_BOUNDS,
    region: "SE",
    language: "sv",
    ...(sessionToken ? { sessionToken } : {}),
  };

  const { suggestions } =
    await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(req);

  return suggestions ?? [];
}; 