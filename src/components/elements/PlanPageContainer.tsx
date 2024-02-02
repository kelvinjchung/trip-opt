"use client";

import { Plan } from "@prisma/client";
import { createContext, useContext } from "react";

const PlanContext = createContext<Plan | null>(null);

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlanContext must be used within PlanContainer");
  }
  return context;
};

const PlanPageContainer = ({
  plan,
  children,
}: {
  plan: Plan;
  children: React.ReactNode;
}) => {
  return (
    <PlanContext.Provider value={plan}>
      <div className="flex h-screen w-full">{children}</div>
    </PlanContext.Provider>
  );
};

export default PlanPageContainer;
