"use server";

import prisma from "@/lib/db/prisma";
import { Location } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { getGeocode } from "../googleUtils";

export const getLocationsByDay = async (
  id: string,
  startDate: Date,
  endDate: Date,
) => {
  try {
    const locations = await prisma.location.findMany({
      where: { planId: id },
    });

    const numDays = differenceInCalendarDays(endDate, startDate) + 1;
    // locationsByDay is an array of length numDays + 1
    // locationsByDay[0] is an array of locations with dateTime === null
    // locationsByDay[x] is an array of locations with dateTime === startDate + x - 1
    const locationsByDay = Array.from(
      Array(numDays + 1),
      () => [] as Location[],
    );
    for (const location of locations) {
      const date = location.dateTime;
      if (date === undefined || date === null) {
        locationsByDay[0].push(location);
      } else {
        const dateNum = differenceInCalendarDays(date, startDate) + 1;
        locationsByDay[dateNum].push(location);
      }
    }

    return locationsByDay;
  } catch (e) {
    console.log(e);
    throw new Error("Unable to get locations");
  }
};

export const addLocation = async (
  planId: string,
  placeName: string,
  place_id: string,
) => {
  try {
    const geocodeResponse = await getGeocode(place_id);
    const { lat, lng } = geocodeResponse.geometry.location;
    const location = await prisma.location.create({
      data: {
        name: placeName,
        place_id,
        lat,
        lng,
        address: geocodeResponse.formatted_address,
        types: geocodeResponse.types,
        locked: false,
        Plan: {
          connect: {
            id: planId,
          },
        },
      },
    });

    revalidatePath(`/plan/${planId}`, "page");
  } catch (e: unknown) {
    console.log(e);
  }
};

export const deleteLocation = async (planId: string, locationId: string) => {
  try {
    await prisma.location.delete({
      where: { id: locationId },
    });

    revalidatePath(`/plan/${planId}`, "page");
  } catch (e: unknown) {
    throw new Error("Unable to delete location");
  }
};

export const updateLocationDate = async (
  planId: string,
  locationId: string,
  dateTime: Date | null,
) => {
  try {
    await prisma.location.update({
      where: { id: locationId },
      data: { dateTime, locked: dateTime !== null },
    });

    revalidatePath(`/plan/${planId}`, "page");
  } catch (e: unknown) {
    console.log(e);
    // throw new Error("Unable to update location date");
  }
};
