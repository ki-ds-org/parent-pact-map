declare module 'react-leaflet-heatmap-layer' {
  import { Component } from 'react';

  interface HeatmapLayerProps {
    points: number[][];
    longitudeExtractor: (point: number[]) => number;
    latitudeExtractor: (point: number[]) => number;
    intensityExtractor: (point: number[]) => number;
    radius?: number;
    blur?: number;
    max?: number;
    minOpacity?: number;
    fitBoundsOnLoad?: boolean;
    fitBoundsOnUpdate?: boolean;
  }

  export class HeatmapLayer extends Component<HeatmapLayerProps> {}
}
