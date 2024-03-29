"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  setDateRange: SelectRangeEventHandler;
  dateFormat?: string;
  onOpenChange?: (open: boolean) => void;
}

const DateRangePicker = ({
  dateRange,
  setDateRange,
  dateFormat = "LLL dd",
  onOpenChange: handleOpenChange,
}: DateRangePickerProps) => {
  return (
    <div>
      <Popover onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start font-normal",
              !dateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, dateFormat)} -{" "}
                  {format(dateRange.to, dateFormat)}
                </>
              ) : (
                format(dateRange.from, dateFormat)
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={window.innerWidth > 768 ? 2 : 1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
