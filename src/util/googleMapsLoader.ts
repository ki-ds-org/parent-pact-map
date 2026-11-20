let mapsLoaderPromise: Promise<void> | null = null;

export function loadGoogleMapsJs(apiKey?: string): Promise<void> {
  if (typeof google !== "undefined" && google.maps?.Geocoder) {
    return Promise.resolve();
  }
  if (mapsLoaderPromise) return mapsLoaderPromise;

  mapsLoaderPromise = new Promise<void>((resolve, reject) => {
    window.__initGmaps = () => resolve();

    const params = new URLSearchParams({
      key: apiKey ?? "",
      v: "weekly",
      libraries: "places,geocoding",
      loading: "async",
      callback: "__initGmaps",
    });

    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps JS"));
    document.head.appendChild(s);
  });

  return mapsLoaderPromise;
} 