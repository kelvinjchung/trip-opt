"use client";

import { addLocation } from "@/lib/actions/location.actions";
import { usePlacesSearch } from "@/lib/hooks/usePlacesSearch";
import { Location, Plan } from "@prisma/client";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { useOptimistic } from "react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LocationCard from "./LocationCard";
import LocationList from "./LocationList";
import { PlacesSearch } from "./PlacesSearch";
import { usePlanContext } from "./PlanPageContainer";
import TripHeader from "./TripHeader";
import TripNameDisplayInput from "./TripNameDisplayInput";

interface SideBarProps {
  locations: Location[][];
}

const SideBar = ({ locations: locationsByDay }: SideBarProps) => {
  // const [optimisticLocations, addOptimisticLocation] = useOptimistic(
  //   locations,
  //   (currLocations, newLocation) => {
  //     return [...currLocations, newLocation];
  //   },
  // );
  const plan = usePlanContext();
  const { value, setValue, suggestions, ...placesSearchProps } =
    usePlacesSearch({
      requestOptions: {
        locationBias: {
          radius: 40000, // approx 25 miles
          center: {
            lat: plan.destination.lat,
            lng: plan.destination.lng,
          },
        },
      },
    });

  const handleSelect = async (idx: number) => {
    const place = suggestions.data[idx];
    // addOptimisticLocation()
    addLocation(plan.id, place.structured_formatting.main_text, place.place_id);
    setValue("");
  };

  return (
    <section className="w-[500px] overflow-scroll py-16 lg:w-[700px] [&>div]:mx-8 lg:[&>div]:mx-24">
      <TripHeader />
      <div className="mt-8">
        <PlacesSearch
          onSelect={handleSelect}
          {...{ suggestions, ...placesSearchProps }}
        >
          <PlacesSearch.Input
            placeholder="Add a location"
            value={value}
            setValue={setValue}
          />
          <PlacesSearch.ListBox />
        </PlacesSearch>
        {locationsByDay.map((locations, day) => (
          <LocationList
            key={`collapsible-list-${day}`}
            day={day}
            locations={locations}
          />
        ))}
      </div>
      {/* <Tabs orientation="vertical" className="flex flex-row">
        <TabsList className="h-auto flex-col">
          <TabsTrigger value="general" className="h-12">
            General
          </TabsTrigger>
          <TabsTrigger value="dates">Dates</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="">
          <div>General</div>
        </TabsContent>
        <TabsContent value="dates" className="">
          <div>Dates</div>
        </TabsContent>
      </Tabs> */}
    </section>
  );
};

export default SideBar;
