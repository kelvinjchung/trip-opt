import CreatePlan from "@/components/forms/CreatePlan";

const DashboardPage = () => {
  return (
    <main className="mt-10">
      <div className="container flex flex-col items-center bg-slate-100">
        <div className="flex h-40 w-80 items-center justify-center rounded-md text-5xl outline outline-1">
          Logo
        </div>
      </div>
      <div className="container mt-8 flex flex-col gap-3 bg-red-100 pt-4">
        <h1 className="text-2xl font-bold">Your Plans</h1>
        <div className="flex flex-row">
          <div className="flex h-48 w-80 items-center justify-center rounded-md text-5xl outline outline-1">
            Plan 1
          </div>
        </div>
      </div>
      <div className="container mt-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Optimize a new trip</h1>
        <CreatePlan />
      </div>
    </main>
  );
};

export default DashboardPage;
