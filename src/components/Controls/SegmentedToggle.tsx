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
      className="c-segmented-toggle"
      aria-label={`Välj mellan ${labels[0]} och ${labels[1]}`}
    >
      <button
        type="button"
        className="c-segmented-toggle__segment"
        onClick={() => onChange(left)}
        aria-pressed={isLeft}
        aria-label={labels[0]}
      >
        {labels[0]}
      </button>
      <button
        type="button"
        className="c-segmented-toggle__segment"
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
