"use client";

import { Libraries, useLoadScript } from "@react-google-maps/api";

const libraries: Libraries = ["places"];

const GoogleMapsAPILoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  return isLoaded ? <>{children}</> : <div>Loading...</div>;
};

export default GoogleMapsAPILoader;
