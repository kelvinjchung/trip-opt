import Map from "@/components/elements/Map";
import PlanPageContainer from "@/components/elements/PlanPageContainer";
import SideBar from "@/components/elements/SideBar";
import { getLocationsByDay } from "@/lib/actions/location.actions";
import { getPlan } from "@/lib/actions/plan.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// TODO: generate metadata for plan page
// export async function generateMetaData()

const PlanPage = async ({
  params: { planId },
}: {
  params: { planId: string };
}) => {
  // TODO: add planId to context along with user auth
  const plan = await getPlan(planId);
  if (!plan) {
    notFound();
  }
  const locations = await getLocationsByDay(
    planId,
    plan.startDate,
    plan.endDate,
  );

  return (
    <main>
      <PlanPageContainer plan={plan}>
        <SideBar locations={locations} />
        <Map locations={locations} />
      </PlanPageContainer>
    </main>
  );
};

export default PlanPage;
