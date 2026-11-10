import { useRef, type KeyboardEvent } from "react";

export type MapView = "map" | "list";

interface MapViewTabsProps {
  activeView: MapView;
  onChange: (view: MapView) => void;
}

const views: { id: MapView; label: string }[] = [
  { id: "map", label: "Karta" },
  { id: "list", label: "Lista" },
];

export default function MapViewTabs({
  activeView,
  onChange,
}: MapViewTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = views.findIndex((view) => view.id === activeView);
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % views.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + views.length) % views.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = views.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextView = views[nextIndex];
    onChange(nextView.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="c-map-view-tabs" role="tablist" aria-label="Vy">
      {views.map(({ id, label }, index) => (
        <button
          key={id}
          ref={(element) => {
            tabRefs.current[index] = element;
          }}
          id={`map-view-tab-${id}`}
          type="button"
          role="tab"
          aria-selected={activeView === id}
          aria-controls={`map-view-panel-${id}`}
          tabIndex={activeView === id ? 0 : -1}
          className="c-map-view-tabs__tab"
          onClick={() => onChange(id)}
          onKeyDown={handleKeyDown}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
