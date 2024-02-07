import {
  getLocationsByDay,
  updateLocationDate,
} from "@/lib/actions/location.actions";
import { updatePlanDates } from "@/lib/actions/plan.actions";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  isEqual,
  subDays,
} from "date-fns";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
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
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  // array of location ids to be unscheduled
  const [locationIdsUnsched, setLocationIdsUnsched] = useState<string[]>([]);
  const { toast } = useToast();

  // if date range picker closes after selecting a new date range,
  // change the plan dates
  const handleDateRangeOpenChange = async (open: boolean) => {
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
      // check if removed day has locations and ask for confirmation
      const removedDays: Date[] = [];
      if (differenceInCalendarDays(dateRange.from, startDate) > 0) {
        const removedDaysLeft = eachDayOfInterval({
          start: startDate,
          end: subDays(dateRange.from, 1),
        });
        removedDays.push(...removedDaysLeft);
      }
      if (differenceInCalendarDays(endDate, dateRange.to) > 0) {
        const removedDaysRight = eachDayOfInterval({
          start: addDays(dateRange.to, 1),
          end: endDate,
        });
        removedDays.push(...removedDaysRight);
      }

      const locationsByDay = await getLocationsByDay(
        planId,
        startDate,
        endDate,
      );
      const locationIds: string[] = [];
      for (const day of removedDays) {
        const dayNum = differenceInCalendarDays(day, startDate) + 1;
        if (locationsByDay[dayNum].length > 0) {
          locationIds.push(...locationsByDay[dayNum].map((l) => l.id));
        }
      }
      if (locationIds.length > 0) {
        setLocationIdsUnsched(locationIds);
        setIsAlertOpen(true);
        return;
      }
      tryUpdatePlanDates();
    }
  };

  const handleAlertCancel = () => {
    setDateRange({ from: startDate, to: endDate });
    setIsAlertOpen(false);
  };

  const handleAlertContinue = async () => {
    // locationIdsUnsched is set in handleDateRangeOpenChange
    // if alert is open, locationIdsUnsched will not be empty
    tryUpdatePlanDates(locationIdsUnsched);
    setIsAlertOpen(false);
    setLocationIdsUnsched([]);
  };

  const tryUpdatePlanDates = async (locationIds?: string[]) => {
    try {
      if (locationIds) {
        for (const id of locationIds) {
          await updateLocationDate(planId, id, null);
        }
      }
      await updatePlanDates(planId, dateRange!.from!, dateRange!.to!);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "We were unable to update plan dates. Please try again.",
      });
      setDateRange({ from: startDate, to: endDate });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <TripNameDisplayInput />
      <DateRangePicker
        dateFormat="L/d"
        dateRange={dateRange}
        setDateRange={setDateRange}
        onOpenChange={handleDateRangeOpenChange}
        className="w-32 justify-center"
      />
      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Some locations are scheduled for the days you are removing.
              Proceeding with the change will unschedule these locations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleAlertCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* ??? TODO: DELETE PLAN BUTTON */}
    </div>
  );
};

export default TripHeader;
