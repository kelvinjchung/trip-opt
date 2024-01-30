"use client";

import { createPlan } from "@/lib/actions/plan.actions";
import { usePlacesSearch } from "@/lib/hooks/usePlacesSearch";
import { createPlanSchema } from "@/lib/validation/createplan.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DateRangePicker from "../elements/DateRangePicker";
import { PlacesSearch } from "../elements/PlacesSearch";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useToast } from "../ui/use-toast";

const CreatePlan = () => {
  const { value, setValue, suggestions, ...placesSearchProps } =
    usePlacesSearch({
      requestOptions: {
        types: ["(regions)"],
      },
    });

  const form = useForm<z.infer<typeof createPlanSchema>>({
    resolver: zodResolver(createPlanSchema),
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { toast } = useToast();

  // for PlacesSearch selection
  const handleSelect = (idx: number) => {
    if (placesSearchProps.selectedIdx === idx) {
      placesSearchProps.setSelectedIdx(null);
      form.resetField("destination");
      inputRef.current?.blur();
      setValue("");
    } else {
      placesSearchProps.setSelectedIdx(idx);
      placesSearchProps.setCurrIdx(null);
      setValue(suggestions.data[idx].structured_formatting.main_text, false);
      form.setValue("destination", {
        name: suggestions.data[idx].structured_formatting.main_text,
        place_id: suggestions.data[idx].place_id,
      });
    }
  };

  const handleSubmit = async (formData: z.infer<typeof createPlanSchema>) => {
    try {
      const planId = await createPlan(formData);
      if (planId) {
        router.push(`/plan/${planId}`);
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description:
          "We encountered a problem while creating your plan. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-2 md:w-1/3 md:gap-4"
      >
        <FormField
          control={form.control}
          name="destination"
          render={() => (
            <FormItem>
              <FormLabel>Where?</FormLabel>
              <PlacesSearch
                onSelect={handleSelect}
                {...{ suggestions, ...placesSearchProps }}
              >
                <FormControl>
                  <PlacesSearch.Input
                    ref={inputRef}
                    placeholder="Enter a destination"
                    value={value}
                    setValue={setValue}
                  />
                </FormControl>
                <PlacesSearch.ListBox />
              </PlacesSearch>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>When?</FormLabel>
              <FormControl>
                <DateRangePicker
                  dateRange={field.value}
                  setDateRange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">GO!</Button>
      </form>
    </Form>
  );
};

export default CreatePlan;
