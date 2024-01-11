import { z } from "zod";

// TODO: add validation for timezone
export const createPlanSchema = z.object({
  destination: z.object(
    {
      name: z.string().min(1),
      place_id: z.string().min(1),
    },
    { required_error: "Please select a destination." },
  ),
  dates: z
    .object(
      {
        from: z.date(),
        to: z.date(),
      },
      { required_error: "Please select dates for your trip." },
    )
    .partial({
      to: true,
    }),
});
