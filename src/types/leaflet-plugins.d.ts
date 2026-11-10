import "leaflet";

declare module "leaflet" {
  interface MarkerCluster extends Marker {
    getAllChildMarkers(): Marker[];
    getChildCount(): number;
  }

  interface MarkerClusterGroupOptions {
    iconCreateFunction?: (cluster: MarkerCluster) => DivIcon;
    showCoverageOnHover?: boolean;
  }

  interface HeatLayerOptions {
    radius?: number;
    max?: number;
    minOpacity?: number;
  }

  interface BoundaryCanvasOptions extends TileLayerOptions {
    boundary: GeoJSON.GeoJsonObject;
  }

  function markerClusterGroup(
    options?: MarkerClusterGroupOptions
  ): FeatureGroup;
  function heatLayer(
    points: LatLngExpression[],
    options?: HeatLayerOptions
  ): Layer;

  namespace TileLayer {
    class BoundaryCanvas extends TileLayer {
      constructor(url: string, options: BoundaryCanvasOptions);
    }
  }
}
