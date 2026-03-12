interface SegmentedToggleProps<T extends string> {
  options: [T, T];
  value: T;
  onChange: (value: T) => void;
  labels: [string, string];
}

function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  labels,
}: SegmentedToggleProps<T>) {
  const [left, right] = options;
  const isLeft = value === left;

  return (
    <div
      role="group"
      className="segmented-toggle inline-flex rounded-md overflow-hidden border border-surface-secondary"
      aria-label={`Välj mellan ${labels[0]} och ${labels[1]}`}
    >
      <button
        type="button"
        className={`segmented-toggle-segment px-2.5 py-1 text-xs cursor-pointer transition-colors border-none ${
          isLeft
            ? "bg-primary text-on-primary"
            : "bg-surface/50 text-on-background/70 hover:bg-surface hover:text-on-background"
        }`}
        onClick={() => onChange(left)}
        aria-pressed={isLeft}
        aria-label={labels[0]}
      >
        {labels[0]}
      </button>
      <button
        type="button"
        className={`segmented-toggle-segment px-2.5 py-1 text-xs cursor-pointer transition-colors border-l border-surface-secondary border-none ${
          !isLeft
            ? "bg-primary text-on-primary"
            : "bg-surface/50 text-on-background/70 hover:bg-surface hover:text-on-background"
        }`}
        onClick={() => onChange(right)}
        aria-pressed={!isLeft}
        aria-label={labels[1]}
      >
        {labels[1]}
      </button>
    </div>
  );
}

export default SegmentedToggle;
