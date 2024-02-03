import { Location } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function partitionLocationsByDay(
  locations: Location[],
  numDays: number,
) {
  // initialize an array of length numDays + 1 with empty arrays
  const initialArray = Array.from(Array(numDays + 1), () => [] as Location[]);

  // locationsByDay[] is an array of length numDays + 1
  // locationsByDay[x] is an array of locations with day === x
  // locationsByDay[-1] is an array of locations with day === null
  const locationsByDay = locations.reduce((acc, location) => {
    const date = location.day;
    if (date === null) {
      if (!acc[numDays]) {
        acc[numDays] = [];
      }
      acc[numDays].push(location);
      return acc;
    }
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(location);
    return acc;
  }, initialArray);
  return locationsByDay;
}
