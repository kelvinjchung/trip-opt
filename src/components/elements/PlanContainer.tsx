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

const PlanContainer = ({
  plan,
  children,
}: {
  plan: Plan;
  children: React.ReactNode;
}) => {
  return (
    <PlanContext.Provider value={plan}>
      <div className="grid h-screen grid-cols-3 md:grid-cols-5">{children}</div>
    </PlanContext.Provider>
  );
};

export default PlanContainer;
