import type { Suggestion } from "../types/SearchTypes";

export interface LocationInfo {
  coordinates: [number, number];
  municipality?: string;
  formattedAddress?: string;
}

/**
 * Extracts municipality information from Google Places API address components
 * @param addressComponents - Array of address components from Google Places API
 * @returns Municipality name or undefined if not found
 */
type AddressComponent =
  | google.maps.GeocoderAddressComponent
  | google.maps.places.AddressComponent;

export const extractMunicipality = (
  addressComponents: AddressComponent[]
): string | undefined => {
  const municipalityComponent = addressComponents.find(
    (component) =>
      component.types.includes("administrative_area_level_2") ||
      component.types.includes("locality") ||
      component.types.includes("postal_town")
  );

  if (municipalityComponent) {
    if ("longText" in municipalityComponent) {
      return (
        municipalityComponent.longText ??
        municipalityComponent.shortText ??
        undefined
      );
    }
    return municipalityComponent.long_name || municipalityComponent.short_name;
  }

  return undefined;
};

export const resolveSuggestionToCoords = async (
  s: Suggestion
): Promise<LocationInfo | null> => {
  const place = s.placePrediction?.toPlace();
  if (!place) return null;
  
  await place.fetchFields({
    fields: ["location", "formattedAddress", "displayName", "addressComponents"],
  });

  const loc = place.location;
  if (!loc) return null;

  // Extract municipality from address components
  const municipality = extractMunicipality(place.addressComponents || []);

  return {
    coordinates: [loc.lat(), loc.lng()],
    municipality,
    formattedAddress: place.formattedAddress || undefined,
  };
};

export const geocodeAddress = async (
  address: string,
  geocoder: google.maps.Geocoder | null
): Promise<LocationInfo | null> => {
  if (!geocoder) return null;

  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { address, componentRestrictions: { country: "se" } },
      (results, status) => {
        if (status === "OK" && results?.[0]) {
          const result = results[0];
          const loc = result.geometry.location;
          
          // Extract municipality from address components
          const municipality = extractMunicipality(result.address_components);
          
          resolve({
            coordinates: [loc.lat(), loc.lng()],
            municipality,
            formattedAddress: result.formatted_address
          });
        } else if (status === "ZERO_RESULTS") {
          resolve(null);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      }
    );
  });
}; 