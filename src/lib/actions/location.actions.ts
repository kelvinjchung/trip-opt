"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { getGeocode } from "../googleUtils";

export const getLocations = async (id: string) => {
  try {
    const locations = await prisma.location.findMany({
      where: { planId: id },
    });

    return locations;
  } catch (e) {
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
  day: number,
) => {
  try {
    await prisma.location.update({
      where: { id: locationId },
      data: { day },
    });

    revalidatePath(`/plan/${planId}`, "page");
  } catch (e: unknown) {
    console.log(e);
    // throw new Error("Unable to update location date");
  }
};
