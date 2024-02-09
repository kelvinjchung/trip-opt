import { Location } from "@prisma/client";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import LocationCard from "./LocationCard";
import { usePlanContext } from "./PlanPageContainer";

interface LocationListProps {
  day: number;
  locations: Location[];
}

const LocationList = ({ day, locations }: LocationListProps) => {
  const { startDate } = usePlanContext();
  const heading =
    day === 0
      ? "Unscheduled"
      : format(addDays(startDate, day - 1), "EEEE, MMMM do");

  const [isOpen, setIsOpen] = useState(locations.length > 0);

  const pinColor = day === 0 ? "#000000" : pinColorMap[day - 1];

  useEffect(() => {
    setIsOpen(locations.length > 0);
  }, [locations]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <CollapsibleTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between rounded-md py-1 pl-2 pr-1 transition-colors hover:bg-accent hover:text-accent-foreground">
          <h2 className="text-xl font-semibold">{heading}</h2>
          <button>
            {isOpen ? (
              <ChevronDownIcon className="h-6 w-6" />
            ) : (
              <ChevronUpIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="mt-2 flex flex-col gap-2 pr-3">
          {locations.length ? (
            locations.map((location, idx) => (
              <LocationCard
                key={location.id}
                name={location.name}
                date={location.dateTime}
                locationId={location.id}
                pinNum={idx + 1}
                pinColor={pinColor}
              />
            ))
          ) : (
            <div className="px-2">
              {day === 0 ? (
                <h2>No unscheduled locations!</h2>
              ) : (
                <>
                  <h2 className="mb-2">
                    No locations planned for{" "}
                    {format(addDays(startDate, day), "EEEE")}!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Move a location here to lock it to this day, or click the{" "}
                    <span className="font-semibold">Optimize</span> button to
                    let us do it for you.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const pinColorMap = [
  "#DF2121",
  "#EF4442",
  "#FF6663",
  "#FE7839",
  "#E9A845",
  "#E5D44A",
  "#E0FF4F",
  "#72C43A",
  "#3BA62F",
  "#038824",
  "#27AD72",
  "#4AD2C0",
  "#5AA3C9",
  "#6973D2",
  "#8F63DB",
  "#B552E3",
  "#EF5DE5",
  "#ED5EAB",
];

export default LocationList;
