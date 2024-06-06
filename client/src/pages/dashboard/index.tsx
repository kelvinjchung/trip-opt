import PlanCarousel from "@/components/PlanCarousel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { CircleUserRound } from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="mx-8 my-16 flex flex-col sm:mx-20 md:mx-24 lg:mx-32 [&>div]:mb-4">
      <div className="h-40 text-center">
        <h1 className="mb-4 text-4xl font-semibold">Logo</h1>
      </div>
      <div className="flex flex-col">
        <div className="flex items-end justify-between">
          <h1 className="text-3xl font-semibold">Your Plans</h1>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <CircleUserRound className="h-8 w-8 cursor-pointer text-muted-foreground" />
            </SignInButton>
          </SignedOut>
        </div>
        {/* <SignedIn> */}
        <PlanCarousel />
        {/* </SignedIn> */}
        {/* <SignedOut> */}
        <div className="flex h-80 flex-col items-center justify-center">
          <p className="mb-4 text-lg text-muted-foreground">
            Sign in to view your plans
          </p>
          <SignInButton mode="modal">
            <div className={cn(buttonVariants(), "cursor-pointer")}>
              Sign in
            </div>
          </SignInButton>
        </div>
        {/* </SignedOut> */}
      </div>
      <div className="flex flex-col items-center [&>*]:mb-2">
        <h1 className="text-3xl">Plan a New Trip</h1>
        <div className="p-1 outline">PlacesSearch Input</div>
        <div className="p-1 outline">Dates Input</div>
        <div className="p-1 outline">Confirm Button</div>
      </div>
    </div>
  );
};
