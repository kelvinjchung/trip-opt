"use server";

import prisma from "@/lib/db/prisma";
import { Client as GoogleAPIClient } from "@googlemaps/google-maps-services-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createPlanSchema } from "../validation/createplan.validation";

export const getPlan = async (id: string) => {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id },
    });
    return plan;
  } catch (e: unknown) {
    throw new Error("Plan not found");
  }
};

export const createPlan = async (
  formData: z.infer<typeof createPlanSchema>,
) => {
  const { destination, dates } = formData;
  const client = new GoogleAPIClient({});

  try {
    const response = await client
      .geocode({
        params: {
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
          place_id: destination.place_id,
        },
      })
      .then((r) => r.data.results[0]);

    const { lat, lng } = response.geometry.location;

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
        endDate: dates.to,
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
