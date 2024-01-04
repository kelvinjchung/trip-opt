"use client";

import { createPlan } from "@/lib/actions/plan.actions";
import { usePlacesSearch } from "@/lib/hooks/usePlacesSearch";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import DateRangePicker from "../elements/DateRangePicker";
import PlacesSearch from "../elements/PlacesSearch";
import { Button } from "../ui/button";

const CreatePlan = () => {
  const { suggestions, ...placesSearchProps } = usePlacesSearch({
    requestOptions: {
      types: ["(regions)"],
    },
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const selectedPlace = suggestions.data[placesSearchProps.selectedIdx!];

  const createPlanWithProps = createPlan.bind(null, dateRange!, selectedPlace);

  return (
    <form action={createPlanWithProps} className="flex flex-col gap-2 md:w-1/3">
      <PlacesSearch
        placeholder="Enter a destination"
        suggestions={suggestions}
        {...placesSearchProps}
      />
      <DateRangePicker {...{ dateRange, setDateRange }} />
      <Button type="submit">Go!</Button>
    </form>
  );
};

export default CreatePlan;
