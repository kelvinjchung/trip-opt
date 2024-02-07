import { CalendarIcon } from "@radix-ui/react-icons";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isWithinInterval,
} from "date-fns";
import { Day, DayProps, Row, RowProps } from "react-day-picker";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { usePlanContext } from "./PlanPageContainer";

function OnlyTripRow(props: RowProps) {
  const { startDate, endDate } = usePlanContext();

  const isTripRow = props.dates.some((date) =>
    isWithinInterval(date, { start: startDate, end: endDate }),
  );
  if (!isTripRow) return <></>;
  return <Row {...props} />;
}

const DatePicker = ({ date, onSelect }) => {
  const { startDate, endDate } = usePlanContext();
  const hiddenDays = { before: startDate, after: endDate };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <CalendarIcon className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-auto p-0">
        {/* <div className="p-3">
          <h4 className="mb-2">Lock Date to: </h4>
          <div>
            {dates.map((date, idx) => (
              <div key={date}>{date}</div>
            ))}
          </div>
        </div> */}
        <h2 className="mx-4 mt-3 text-sm font-medium">Lock Date to:</h2>
        <Calendar
          hidden={hiddenDays}
          mode="single"
          selected={date}
          classNames={{
            row: "",
            head_row: "",
          }} // flex creates weird spacing issues with hidden days
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
