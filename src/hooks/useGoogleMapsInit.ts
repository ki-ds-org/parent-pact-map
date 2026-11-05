/// <reference path="../types/google-maps.d.ts" />
import { useEffect, useRef, useState } from "react";
import { loadGoogleMapsJs } from "../util/googleMapsLoader";

export const useGoogleMapsInit = (apiKey?: string) => {
  const geocoderRef = useRef<any>(null);
  const sessionTokenRef = useRef<any>(null);
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
