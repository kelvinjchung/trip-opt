import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import LocationCard from "./LocationCard";
import { usePlanContext } from "./PlanPageContainer";

interface CollapsibleDateProps {
  children: React.ReactNode;
  day: number;
}

const CollapsibleDate = ({ children, day }: CollapsibleDateProps) => {
  const { startDate } = usePlanContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground">
          <h2 className="text-lg font-semibold">
            {format(addDays(startDate, day), "EEEE, MMMM do")}
          </h2>
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
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleDate;
