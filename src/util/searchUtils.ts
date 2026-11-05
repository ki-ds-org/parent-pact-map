import type { Suggestion } from '../types/SearchTypes';

type AddressComponent = {
  types?: string[];
  longText?: string | null;
  shortText?: string | null;
  long_name?: string;
};

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
export const extractMunicipality = (
  addressComponents: AddressComponent[] | null | undefined
): string | undefined => {
  if (!addressComponents || !Array.isArray(addressComponents)) {
    return undefined;
  }

  // Debug: Log all address components to understand the structure
  // console.log('Address components:', addressComponents);

  // In Sweden, municipalities are typically administrative_area_level_2
  // or sometimes locality for smaller municipalities
  // postal_town is often more reliable for municipality names
  const municipalityComponent = addressComponents.find(
    (component) => 
      component.types?.includes('administrative_area_level_2') ||
      component.types?.includes('locality') ||
      component.types?.includes('postal_town')
  );

  if (municipalityComponent) {
    const municipality = municipalityComponent.longText || municipalityComponent.shortText || municipalityComponent.long_name;
    return municipality;
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

  const lat = loc.lat();
  const lng = loc.lng();
  
  // Extract municipality from address components
  const municipality = extractMunicipality(place.addressComponents || []);
  
  return {
    coordinates: [lat, lng],
    municipality,
    formattedAddress: place.formattedAddress || undefined
  };
};

export const geocodeAddress = async (
  address: string,
  geocoder: google.maps.Geocoder | null
): Promise<LocationInfo | null> => {
  if (!geocoder) return null;

  return new Promise((resolve) => {
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
        } else {
          resolve(null);
        }
      }
    );
  });
}; 