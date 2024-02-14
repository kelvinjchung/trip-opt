import GoogleMapsAPILoader from "@/components/elements/GoogleMapsAPILoader";

export default function PlanPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GoogleMapsAPILoader>{children}</GoogleMapsAPILoader>;
}
