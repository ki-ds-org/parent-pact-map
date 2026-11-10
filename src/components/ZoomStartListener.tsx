import { useMapEvent } from "react-leaflet";

const ZoomStartListener = ({ onZoomStart }: { onZoomStart: () => void }) => {
  useMapEvent("zoomstart", () => {
    onZoomStart();
  });
  return null;
};

export default ZoomStartListener;
