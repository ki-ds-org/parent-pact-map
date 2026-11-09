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
      className="c-search-info"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2 className="c-search-info__title">{title}</h2>
      <p className="c-search-info__description">{description}</p>
    </div>
  );
}
