"use client";

import { Libraries, useJsApiLoader } from "@react-google-maps/api";

const libraries: Libraries = ["places"];

const GoogleMapsAPILoader = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  return isLoaded ? <>{children}</> : <div>Loading...</div>;
};

export default GoogleMapsAPILoader;
