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
    <li className="flex flex-col p-4 bg-inherit border-b border-gray-200 transition-shadow duration-200">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium flex gap-1 text-lg">{title}</h3>
        {callToAction && (
          <Button
            as="a"
            href={link}
            variant="primary"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            {callToAction}
          </Button>
        )}
      </div>
      <div className="flex-1">
        <p className="flex gap-1 text-sm">{description}</p>
        <p className="flex flex-wrap gap-2 pt-2">
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
