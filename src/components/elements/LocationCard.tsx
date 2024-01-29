import { CalendarIcon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import PinSVG from "./PinSVG";

const LocationCard = () => {
  return (
    <div>
      <div className="relative">
        <span className="absolute -left-[11px] top-2">
          <PinSVG num={1} />
        </span>
      </div>
      <div className="flex rounded-md outline outline-1">
        <div className="w-64 rounded-s-md text-center outline outline-1">
          Image
        </div>
        <div className="flex flex-col px-4 py-2">
          <div className="">
            <h2 className="text-xl font-semibold">Name</h2>
            <p className="line-clamp-2">
              Add note Add note Add note Add note Add note Add note Add note Add
              note Add note Add note Add note Add note Add note
            </p>
          </div>
          <div className="mt-2 flex justify-end gap-6">
            <button>
              <CalendarIcon className="h-6 w-6" />
            </button>
            <button>
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
