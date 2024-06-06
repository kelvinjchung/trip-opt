const PlanCard = () => {
  return (
    <div className="m-1 flex flex-col rounded-xl border bg-card p-6 text-card-foreground shadow">
      <div className="mb-2 w-full py-14 outline outline-2">
        {/* Image */}
        Placeholder Image
      </div>
      <div className="flex flex-wrap items-baseline justify-between">
        <h2 className="pr-10 text-xl">Plan Name</h2>
        <p className="text-sm text-muted-foreground">Sep 23 - Oct 1, 2023</p>
      </div>
    </div>
  );
};

export default PlanCard;
