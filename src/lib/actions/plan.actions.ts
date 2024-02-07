"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getGeocode } from "../googleUtils";
import { createPlanSchema } from "../validation/createplan.validation";

export const getPlan = async (id: string) => {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id },
    });
    return plan;
  } catch (e: unknown) {
    // throw new Error("Plan not found");
    // notFound();
    // return null;
  }
};

export const createPlan = async (
  formData: z.infer<typeof createPlanSchema>,
) => {
  const { destination, dates } = formData;

  try {
    const geocodeResponse = await getGeocode(destination.place_id);

    const { lat, lng } = geocodeResponse.geometry.location;

    const plan = await prisma.plan.create({
      data: {
        name: `Trip to ${destination.name}`,
        destination: {
          name: destination.name,
          place_id: destination.place_id,
          lat,
          lng,
        },
        startDate: dates.from,
        endDate: dates.to ?? dates.from,
      },
    });

    return plan.id;
  } catch (e: unknown) {
    if (e instanceof Error) throw new Error(`${e.name}: ${e.message}`);
  }
};

export const updatePlanName = async (id: string, name: string) => {
  try {
    await prisma.plan.update({
      where: { id },
      data: { name },
    });

    // ? don't need to revalidate path since input already has the new name
    // revalidatePath(`/plan/${id}`, "page");
  } catch (e: unknown) {
    // TODO: might need to handle error not to expose internal error
    throw new Error("Unable to update plan");
  }
};

export const updatePlanDates = async (
  id: string,
  newStartDate: Date,
  newEndDate: Date,
) => {
  try {
    await prisma.plan.update({
      where: { id },
      data: { startDate: newStartDate, endDate: newEndDate },
    });

    revalidatePath(`/plan/${id}`, "page");
  } catch (e) {
    throw new Error("Unable to update plan dates");
  }
};
