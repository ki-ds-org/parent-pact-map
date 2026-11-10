import { SWEDEN_BOUNDS } from "../config/searchConfig";
import type { Suggestion } from "../types/SearchTypes";

export const fetchSuggestions = async (
  query: string,
  sessionToken: google.maps.places.AutocompleteSessionToken | null
): Promise<Suggestion[]> => {
  const req: google.maps.places.AutocompleteRequest = {
    input: query.trim(),
    includedRegionCodes: ["SE"],
    locationRestriction: SWEDEN_BOUNDS,
    region: "SE",
    language: "sv",
    sessionToken: sessionToken ?? undefined,
  };

  const { suggestions } =
    await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(req);

  return suggestions ?? [];
}; 