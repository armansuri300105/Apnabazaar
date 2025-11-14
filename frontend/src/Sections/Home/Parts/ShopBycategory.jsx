import { useRef, useEffect, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryItem } from "../Components/Categoryitem";
import CategorySectionSkeleton from "../Skeleton/category";
import { getCategories } from "../../../../API/api";

export const ShopbyCategory = ({ loadinguser }) => {
    const { data, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        select: (res) => res?.data?.categories,
    });

    const scrollRef = useRef(null);
    const intervalRef = useRef(null);
    const isHoveringRef = useRef(false);
    
    // NEW STATE: Determine if the device is likely mobile (e.g., less than 768px width)
    const [isMobile, setIsMobile] = useState(false);

    // config: tweak these for speed
    const SCROLL_STEP = 2; // pixels per tick
    const TICK_DELAY = 20; // ms per tick
    const RESTART_DELAY = 400; // ms to wait after resetting to start

    // --- Media Query Effect to Detect Mobile ---
    useEffect(() => {
        const checkMobile = () => {
            // Set mobile if viewport is 768px or less
            setIsMobile(window.innerWidth <= 768); 
        };
        
        checkMobile(); // Initial check
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // helper to clear interval safely
    const clearAuto = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // start the auto-scroll interval
    const startAuto = useCallback(() => {
        // CONDITIONALLY RETURN: Do not start auto-scroll on mobile
        if (isMobile) { 
            return;
        }

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
    }, [clearAuto, isMobile]); // Added isMobile dependency

    // stop on unmount and CONDITIONAL start
    useEffect(() => {
        // Start auto-scroll ONLY if data is available AND it's NOT a mobile device
        if (data && scrollRef.current && !isMobile) { 
            startAuto();
        }
        return () => clearAuto();
    }, [data, startAuto, clearAuto, isMobile]); // Added isMobile dependency
    
    
    // --- Manual Scroll Handler (REMOVED: The buttons themselves are removed) ---

    // --- Render ---

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
                    
                    {/* Navigation Arrows (REMOVED BUTTONS) */}
                    {/* The buttons were previously rendered here */}

                    {/* Scrollable Row */}
                    <div
                        ref={scrollRef}
                        // Ensure native scrolling works well on mobile
                        className="flex overflow-x-auto scroll-smooth gap-4 px-2 scrollbar-hide touch-pan-x" 
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                        // Mouse handlers only apply to non-touch devices (desktop/tablet pointer input)
                        onMouseEnter={() => {
                            if (!isMobile) {
                                isHoveringRef.current = true;
                                clearAuto();
                            }
                        }}
                        onMouseLeave={() => {
                            if (!isMobile) {
                                isHoveringRef.current = false;
                                setTimeout(() => {
                                    if (!intervalRef.current) startAuto();
                                }, 150);
                            }
                        }}
                    >
                        {data?.map((item, index) => (
                            <div
                                key={index}
                                // Adjusted widths to ensure proper layout on different screen sizes
                                className="flex-shrink-0 w-[140px] xs:w-[160px] sm:w-[180px] md:w-[200px]" 
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