import { useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryItem } from "../Components/Categoryitem";
import CategorySectionSkeleton from "../Skeleton/category";
import { getCategories } from "../../../../API/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ShopbyCategory = ({ loadinguser }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (res) => res?.data?.categories,
  });

  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const isHoveringRef = useRef(false);

  // config: tweak these for speed
  const SCROLL_STEP = 2; // pixels per tick
  const TICK_DELAY = 20; // ms per tick
  const RESTART_DELAY = 400; // ms to wait after resetting to start

  // helper to clear interval safely
  const clearAuto = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // start the auto-scroll interval
  const startAuto = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    clearAuto();

    intervalRef.current = setInterval(() => {
      // if user is hovering, do not auto scroll
      if (isHoveringRef.current) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      // if near end, jump to start (instant), then resume after RESTART_DELAY
      if (container.scrollLeft >= maxScrollLeft - SCROLL_STEP) {
        // stop interval while we jump
        clearAuto();

        // instant jump to start
        container.scrollTo({ left: 0, behavior: "auto" });

        // resume a little later to avoid stutter
        setTimeout(() => {
          // ensure we didn't clear interval externally
          if (!intervalRef.current) {
            startAuto();
          }
        }, RESTART_DELAY);
      } else {
        // normal smooth incremental movement
        container.scrollLeft += SCROLL_STEP;
      }
    }, TICK_DELAY);
  }, [clearAuto]);

  // stop on unmount
  useEffect(() => {
    // start when data is available
    if (data && scrollRef.current) {
      startAuto();
    }
    return () => clearAuto();
  }, [data, startAuto, clearAuto]);

  if (loadinguser || isLoading) return <CategorySectionSkeleton />;

  return (
    <div className="bg-[#f5f5f7] py-12 overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 relative">
        {/* Header */}
        <h2 className="text-center text-[26.5px] font-[500] mb-2">
          Shop By Category
        </h2>
        <p className="text-center text-[#717182] text-[16px] mb-8">
          Browse our wide selection of local products organized by category
        </p>

        {/* Slider Section */}
        <div className="relative">

          {/* Scrollable Row */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth gap-4 px-2 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onMouseEnter={() => {
              isHoveringRef.current = true;
              clearAuto();
            }}
            onMouseLeave={() => {
              isHoveringRef.current = false;
              setTimeout(() => {
                if (!intervalRef.current) startAuto();
              }, 150);
            }}
          >
            {data?.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]"
              >
                <CategoryItem
                  Categoryname={item.Categoryname}
                  no_of_items={item.no_of_items}
                  img_link={item.img_link}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};