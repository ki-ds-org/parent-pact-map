import Button from "../Controls/Button";

interface ListItemProps {
  title: string;
  description: string | React.ReactNode;
  pills?: string[];
  link: string;
  callToAction?: string;
}

function ListItem({
  title,
  description,
  pills,
  link,
  callToAction,
}: ListItemProps) {
  return (
    <li className="c-result">
      <div className="c-result__text">
        <h3 className="c-result__title">{title}</h3>
        <p className="c-result__description">{description}</p>
      </div>
      {callToAction && (
        <Button
          as="a"
          href={link}
          variant="primary"
          size="sm"
        >
          {callToAction}
        </Button>
      )}
    </li>
  );
}

export default ListItem;
