import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsJs } from "../util/googleMapsLoader";

export const useGoogleMapsInit = (apiKey?: string) => {
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsGoogleMapsLoaded(false);

    (async () => {
      await loadGoogleMapsJs(apiKey);
      if (cancelled) return;

      geocoderRef.current = new google.maps.Geocoder();
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      setIsGoogleMapsLoaded(true);
    })().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  return { geocoderRef, sessionTokenRef, isGoogleMapsLoaded };
}; 
