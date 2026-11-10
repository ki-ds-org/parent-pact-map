import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import type { Pact } from "../types/Pact";
import { getJoinUrl } from "../util/joinUrl";
import markerIcon from "../util/markerIcon";

interface ClusterMarkersProps {
  coordinates: [Pact, [number, number]][];
}

function ClusterMarkers({ coordinates }: ClusterMarkersProps) {
  const map = useMap();

  useEffect(() => {
    const markerPacts = new WeakMap<L.Marker, Pact>();
    const markers = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const childMarkers = cluster.getAllChildMarkers();
        let total = childMarkers.reduce((sum, marker) => {
          const pact = markerPacts.get(marker);
          if (!pact) return sum + 1;
          return sum + (pact.studentCount ?? 0);
        }, 0);
        if (total === 0 && childMarkers.length > 0) {
          total = cluster.getChildCount();
        }

        let color = "#757575";
        if (total >= 50) {
          color = "#5e5e5e";
        } else if (total >= 20) {
          color = "#757575";
        }

        return L.divIcon({
          html: `<div class="c-map-marker-cluster" style="background:${color};">
                       <span>${total}</span>
                     </div>`,
          className: "leaflet-marker-cluster",
          iconSize: [40, 40],
        });
      },
      showCoverageOnHover: false,
    });

    coordinates.forEach(([pact, [lat, lng]]) => {
      const marker = L.marker([lat, lng], {
        title: `${pact.name}: ${pact.parentCount} ${
          pact.parentCount === 1 ? "förälder" : "föräldrar"
        }, ${pact.studentCount} ${pact.studentCount === 1 ? "elev" : "elever"}`,
        alt: `${pact.name}: ${pact.parentCount} ${
          pact.parentCount === 1 ? "förälder" : "föräldrar"
        }, ${pact.studentCount} ${pact.studentCount === 1 ? "elev" : "elever"}`,
      }).setIcon(markerIcon);
      markerPacts.set(marker, pact);
      const popup = document.createElement("div");
      popup.className = "c-marker-popup";
      const description = document.createElement("p");
      description.textContent = `${pact.name} (${pact.parentCount} ${
        pact.parentCount === 1 ? "förälder" : "föräldrar"
      }, ${pact.studentCount} ${pact.studentCount === 1 ? "elev" : "elever"})`;
      const link = document.createElement("a");
      link.href = getJoinUrl(pact);
      link.textContent = "Gå med";
      popup.append(description, link);
      marker.bindPopup(popup);
      markers.addLayer(marker);
    });
    map.addLayer(markers);
    return () => {
      map.removeLayer(markers);
    };
  }, [coordinates, map]);

  return null;
}

export default ClusterMarkers;
