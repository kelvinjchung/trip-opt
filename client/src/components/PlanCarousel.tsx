import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PlanCard from "./PlanCard";

const PlanCarousel = () => {
  return (
    <Carousel className="xl:max-w-screen-lg 2xl:max-w-screen-xl">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
          >
            <PlanCard />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mx-1 mt-3">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default PlanCarousel;
