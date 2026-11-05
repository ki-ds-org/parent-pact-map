# Security overview

This is a source-level overview of the React/Vite map as currently implemented. It is not a penetration test or a review of the Google Apps Script, Google Cloud, Geoapify, or GitHub Pages configuration.

## Application model

The app is a public, static client-side widget. It fetches pact data from a Google Apps Script endpoint, loads Google Maps/Places and Geoapify map tiles in the browser, and displays school and municipality information. There is no application authentication or server-side authorization in this repository; data intended for the widget should therefore be treated as public.

## Main risks and recommended actions

| Priority | Area | Observation | Recommended action |
|---|---|---|---|
| High | HTML injection in map popups | `src/components/ClusterMarkers.tsx` interpolates the API-provided `pact.name` and count into an HTML string passed to Leaflet's `bindPopup`. If the data endpoint returns attacker-controlled content, it can execute script in visitors' browsers. | Construct popup content with DOM nodes and `textContent` (or use a safe React/Leaflet popup); validate the response fields and numeric counts before rendering. |
| Medium | Exposed Geoapify key | The tile URL in `src/components/MapContainer.tsx` contains a key in client code. Any browser-delivered key is public and can be copied and used against its provider quota. | Restrict the key to the production site/referrers and required APIs, set quotas/alerts, and rotate it if it was not intended to be public. |
| Medium | Google Maps API key | `VITE_GOOGLE_API_KEY` is bundled into client code by design. `.env` is ignored, but this does not make the production key secret. | Apply HTTP-referrer and API restrictions in Google Cloud; monitor usage and rotate if exposed outside those restrictions. |
| Medium | Data minimization and console logging | Pact data can include `contact`; `useGeolocation` logs selected pact objects, which may include that field. The widget also sends search terms to Google Places/Geocoding. | Do not include personal/contact data in public API responses unless needed. Remove or redact object logging and document the third-party data flow and retention expectations. |
| Low | External browser dependencies | Google Maps, Geoapify, and marker images from unpkg are loaded from third parties. Provider or supply-chain changes can affect the widget and providers receive normal browser request metadata. | Keep dependencies current, use provider restrictions, and periodically review third-party providers and privacy requirements. |

## Existing protections

- `.env` files are ignored by Git, and data-processing scripts read their Tally, OpenCage, and Google API keys from environment variables.
- Search terms are rendered through React components rather than inserted as HTML; the popup construction is the notable exception found in this review.
- API response loading checks that the top-level `municipalities` field is an array, and map coordinates are filtered for finite numbers before use.

## Suggested order

1. Replace dynamic popup HTML with safe DOM construction and validate all API fields used by the map.
2. Restrict and monitor the Geoapify and Google API keys; rotate any key that has been used without restrictions.
3. Confirm that the public endpoint exposes only approved data, remove contact data from logs/responses where unnecessary, and document the external-provider data flow.
