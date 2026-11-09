interface SearchInfoProps {
  title: string;
  description: string;
}

export default function SearchInfo({
  title,
  description,
}: SearchInfoProps) {
  return (
    <div
      className="flex flex-col gap-1 py-2 px-3 bg-background-secondary"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2 className="font-semibold text-sm">{title}</h2>
      <p className="text-xs italic">{description}</p>
    </div>
  );
}
