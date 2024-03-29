"use client";

import {
  deleteLocation,
  updateLocationDate,
} from "@/lib/actions/location.actions";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { TrashIcon } from "@radix-ui/react-icons";
import { addDays, differenceInCalendarDays, format, isEqual } from "date-fns";
import { useState } from "react";
import { Button } from "../ui/button";
import DatePicker from "./DatePicker";
import PinSVG from "./PinSVG";
import { usePlanContext } from "./PlanPageContainer";

interface LocationCardProps {
  name: string;
  date: Date | null;
  locationId: string;
  pinNum: number;
}

const LocationCard = ({
  name,
  date,
  locationId,
  pinNum,
}: LocationCardProps) => {
  // const { listeners, setNodeRef, transform } = useDraggable({
  //   id: locationId,
  // });

  const { id: planId } = usePlanContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    date ?? undefined,
  );

  const handleDeleteClick = async (locationId: string) => {
    await deleteLocation(planId, locationId);
  };

  const handleDateSelect = async (date: Date | undefined) => {
    // TODO: CHANGE
    if (!date) {
      setSelectedDate(undefined);
      await updateLocationDate(planId, locationId, null);
      return;
    }
    setSelectedDate(date);
    await updateLocationDate(planId, locationId, date);
  };

  return (
    <div
    // ref={setNodeRef}
    // style={
    //   transform
    //     ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    //     : undefined
    // }
    // {...listeners}
    >
      <div className="flex rounded-md">
        <div className="z-10 -mr-3 mt-2 h-fit cursor-pointer">
          <PinSVG num={pinNum} />
        </div>
        <div className="w-64 rounded-s-md bg-slate-200 text-center">Image</div>
        <div className="flex w-full min-w-0 flex-col rounded-e-md bg-secondary px-4 py-2">
          <div className="text-of-card">
            <h2 className="truncate text-xl font-semibold">{name}</h2>
            {/* <p className="mt-2 line-clamp-2 text-sm">
              Add note Add note Add note Add note Add note Add note Add note Add
              note Add note Add note Add note Add note Add note
            </p> */}
          </div>
          <div
            className={cn(
              "mt-2 flex items-center justify-between",
              !date && "justify-end",
            )}
          >
            {date ? (
              <div className="text-sm text-muted-foreground">
                <p>
                  Locked to:{" "}
                  <span className="font-medium">{format(date, "M/d")}</span>
                </p>
              </div>
            ) : null}
            <div className="flex items-center gap-6">
              <DatePicker date={selectedDate} onSelect={handleDateSelect} />
              <Button
                onClick={() => handleDeleteClick(locationId)}
                variant="ghost"
                size="icon"
              >
                <TrashIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
