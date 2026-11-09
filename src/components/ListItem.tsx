import Button from "./Button";
import Pill from "./Pill";

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
      <div className="c-result__heading">
        <h3 className="c-result__title">{title}</h3>
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
      </div>
      <div className="c-result__body">
        <p className="c-result__description">{description}</p>
        <p className="c-result__tags">
          {pills?.map((pill) => {
            return (
              <Pill key={pill} variant="secondary">
                {pill}
              </Pill>
            );
          })}
        </p>
      </div>
    </li>
  );
}

export default ListItem;
