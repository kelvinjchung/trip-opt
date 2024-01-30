import { Client as GoogleAPIClient } from "@googlemaps/google-maps-services-js";

export async function getGeocode(place_id: string) {
  const client = new GoogleAPIClient({});
  try {
    const response = await client
      .geocode({
        params: {
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
          place_id: place_id,
        },
      })
      .then((r) => r.data.results[0]);

    return response;
  } catch (e: unknown) {
    throw new Error("Unable to get geocode");
  }
}
