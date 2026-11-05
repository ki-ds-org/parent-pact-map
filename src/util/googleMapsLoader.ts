let mapsLoaderPromise: Promise<void> | null = null;

export function loadGoogleMapsJs(apiKey?: string): Promise<void> {
  // If already loaded, resolve immediately
  if (window.google?.maps?.Geocoder) return Promise.resolve();
  if (mapsLoaderPromise) return mapsLoaderPromise;
  const key = apiKey?.trim();
  if (!key) {
    return Promise.reject(new Error("A Google Maps API key is required"));
  }

  mapsLoaderPromise = new Promise<void>((resolve, reject) => {
    window.__initGmaps = () => resolve();

    const params = new URLSearchParams({
      key,
      v: "weekly",
      libraries: "places,geocoding",
      loading: "async",
      callback: "__initGmaps",
    });

    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    s.async = true;
    s.defer = true;
    s.referrerPolicy = "strict-origin-when-cross-origin";
    s.onerror = () => {
      mapsLoaderPromise = null;
      reject(new Error("Failed to load Google Maps JS"));
    };
    document.head.appendChild(s);
  });

  return mapsLoaderPromise;
} 