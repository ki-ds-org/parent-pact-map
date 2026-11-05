import "leaflet";

declare module "leaflet" {
  interface MarkerCluster extends Marker {
    getAllChildMarkers(): Marker[];
    getChildCount(): number;
  }

  interface MarkerClusterGroupOptions {
    iconCreateFunction?: (cluster: MarkerCluster) => Icon | DivIcon;
    showCoverageOnHover?: boolean;
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): FeatureGroup;

  interface HeatLayerOptions {
    radius?: number;
    max?: number;
    minOpacity?: number;
  }

  function heatLayer(
    latlngs: [number, number, number?][],
    options?: HeatLayerOptions
  ): Layer;

  namespace TileLayer {
    class BoundaryCanvas extends TileLayer {
      constructor(
        urlTemplate: string,
        options?: TileLayerOptions & { boundary: unknown }
      );
    }
  }
}
