import { updatePlanDates } from "@/lib/actions/plan.actions";
import { isEqual } from "date-fns";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import DateRangePicker from "./DateRangePicker";
import { usePlanContext } from "./PlanPageContainer";
import TripNameDisplayInput from "./TripNameDisplayInput";

const TripHeader = () => {
  const { id: planId, startDate, endDate } = usePlanContext();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });
  const { toast } = useToast();

  // if date range picker closes after selecting a new date range,
  // change the plan dates
  const handleOpenChange = async (open: boolean) => {
    if (open) return;

    // if no date range is selected or only one date is selected,
    // revert to the original date range
    if (!dateRange?.from || !dateRange.to) {
      setDateRange({ from: startDate, to: endDate });
      return;
    }

    if (
      !isEqual(dateRange.from, startDate) ||
      !isEqual(dateRange.to, endDate)
    ) {
      try {
        await updatePlanDates(planId, dateRange.from, dateRange.to);
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: "We were unable to update plan dates. Please try again.",
        });
        setDateRange({ from: startDate, to: endDate });
      }
    }
  };

  return (
    <div className="mt-16 flex items-center justify-between">
      <TripNameDisplayInput />
      <DateRangePicker
        dateFormat="L/d"
        dateRange={dateRange}
        setDateRange={setDateRange}
        onOpenChange={handleOpenChange}
      />
      {/* ??? TODO: DELETE PLAN BUTTON */}
    </div>
  );
};

export default TripHeader;
