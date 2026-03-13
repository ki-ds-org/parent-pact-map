import type { Pact } from "../types/Pact";
import ListItem from "./ListItem";
import Button from "./Button";
import noFoundImage from "../assets/not-found.avif";

interface ListProps {
  filteredPacts: Pact[];
  heatMetric: "students" | "parents";
}

function List({ filteredPacts, heatMetric }: ListProps) {
  return (
    <div className="w-full h-full overflow-y-scroll bg-inherit">
      <div className="">
        <ul className="">
          {filteredPacts.map((pact, i) => {
            const count =
              heatMetric === "parents" ? pact.parentCount : pact.studentCount;
            const label =
              heatMetric === "parents"
                ? pact.parentCount === 1
                  ? "förälder"
                  : "föräldrar"
                : pact.studentCount === 1
                  ? "elev"
                  : "elever";
            return (
              <ListItem
                key={`${pact.id}-${i}`}
                title={`${pact.name}`}
                description={`${count} ${label}`}
                link="https://forms.smartphonefreechildhood.se/pakten"
                callToAction="Gå med"
              />
            );
          })}
        </ul>
        {filteredPacts.length === 0 && (
          <div className="text-center py-2 px-4">
            <div className="flex gap-4 mb-4">
              <div className="flex items-center justify-center">
                <img
                  src={noFoundImage}
                  alt="Not found image is a sad face"
                  className="w-14 h-auto"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-left">
                  Ingen pakt hittades
                </h3>
                <p className="text-sm text-left font-light">
                  Men det finns garanterat likasinnade i ditt närområde.
                </p>
              </div>
            </div>
            <div className="flex justify-center md:w-1/2 mx-auto">
              <Button variant="primary" type="button" size="sm" fullWidth>
                Skapa er lokala pakt!
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
