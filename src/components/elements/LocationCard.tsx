"use client";

import { deleteLocation } from "@/lib/actions/plan.actions";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import DatePicker from "./DatePicker";
import PinSVG from "./PinSVG";

const LocationCard = ({ name, locationId }) => {
  const handleDeleteClick = async (locationId: string) => {
    await deleteLocation("65a08af7f713caa14aa14002", locationId);
  };

  return (
    <div>
      <div className="relative">
        <span className="absolute -left-[11px] top-2">
          <PinSVG num={1} />
        </span>
      </div>
      <div className="flex rounded-md">
        <div className="w-64 rounded-s-md bg-slate-200 text-center">Image</div>
        <div className="flex w-full min-w-0 flex-col rounded-e-md bg-secondary px-4 py-2">
          <div className="text-of-card">
            <h2 className="truncate text-xl font-semibold">{name}</h2>
            {/* <p className="mt-2 line-clamp-2 text-sm">
              Add note Add note Add note Add note Add note Add note Add note Add
              note Add note Add note Add note Add note Add note
            </p> */}
          </div>
          <div className="mt-2 flex justify-end gap-6">
            <DatePicker />
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
  );
};

export default LocationCard;
