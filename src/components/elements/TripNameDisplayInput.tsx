"use client";

import { updatePlanName } from "@/lib/actions/plan.actions";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { usePlanContext } from "./PlanContainer";

const TripNameDisplayInput = () => {
  const { name: tripName, id: planId } = usePlanContext();
  const [prevName, setPrevName] = useState(tripName);
  const [content, setContent] = useState(tripName);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleMouseLeave = () => {
    if (!inputRef.current) return;
    if (document.activeElement !== inputRef.current) setIsFocused(false);
  };

  const handleBlur = async () => {
    if (!inputRef.current) return;
    if (!inputRef.current.matches(":hover")) setIsFocused(false);
    inputRef.current.setSelectionRange(0, 0);
    if (prevName !== content) {
      if (!content) {
        // don't update plan if input is empty
        setContent(prevName);
        return;
      }
      try {
        await updatePlanName(planId, content);
        // only run below if updatePlanName succeeds
        setPrevName(content);
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description:
            "We were unable to update your trip name. Please try again.",
        });
        setContent(prevName);
      }
    }
  };

  return (
    <>
      <div
        className={cn(
          "absolute max-w-80 truncate rounded-md bg-transparent px-2 py-1 text-2xl font-semibold transition-colors duration-300 hover:bg-input/50 focus-visible:bg-input/50 focus-visible:outline-none md:text-3xl",
          isFocused && "bg-input/50",
        )}
      >
        <span className="invisible">
          {content ? content : "Enter your trip name"}
        </span>
      </div>
      <input
        ref={inputRef}
        value={content}
        placeholder="Enter your trip name"
        onChange={(e) => setContent(e.target.value)}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className="relative max-w-80 truncate rounded-md bg-transparent px-2 py-1 text-2xl font-semibold focus-visible:outline-none md:text-3xl"
      />
    </>
  );
};

export default TripNameDisplayInput;
