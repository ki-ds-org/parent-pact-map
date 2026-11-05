import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const SwedenMapMaskLayer = () => {
  const map = useMap();

  useEffect(() => {
    fetch("/parent-pact-map/swedengeo2.json")
      .then((res) => res.json())
      .then((swedenGeoJson) => {
        const boundaryLayer = new L.TileLayer.BoundaryCanvas(
          "https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=c7be631f429d488f953709566022593d",
          {
            boundary: swedenGeoJson,
            attribution: `&copy; OpenStreetMap contributors &amp; Geoapify`,
            // maskColor: "rgb(26 23 48)",
          }
        );

        boundaryLayer.addTo(map);
        const bounds = L.geoJSON(swedenGeoJson).getBounds();
        map.fitBounds(bounds);
      });
  }, [map]);

  return null;
};

export default SwedenMapMaskLayer;
