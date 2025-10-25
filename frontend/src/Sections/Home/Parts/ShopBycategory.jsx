import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import { CategoryItem } from "../Components/Categoryitem";
import CategorySectionSkeleton from "../Skeleton/category";
import { getCategories } from "../../../../API/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ShopbyCategory = ({ loadinguser }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (res) => res?.data?.categories,
  });

  if (loadinguser || isLoading) return <CategorySectionSkeleton />;

  // ✅ Custom Next Arrow
  function NextArrow({ className, onClick }) {
    return (
      <div
        onClick={onClick}
        className={`
          ${className} !flex !items-center !justify-center !right-[-10px] !z-10
          !bg-[gray] !text-white rounded-full !w-[20px] !h-[20px]
          shadow-md transition-colors duration-200 cursor-pointer
          sm:hidden  /* ✅ Hide on mobile */
        `}
      >
        <ChevronRight size={40} />
      </div>
    );
  }

  // ✅ Custom Prev Arrow
  function PrevArrow({ className, onClick }) {
    return (
      <div
        onClick={onClick}
        className={`
          ${className} !flex !items-center !justify-center !left-[-10px] !z-10
          !bg-[gray] !text-white rounded-full !w-[20px] !h-[20px]
          shadow-md transition-colors duration-200 cursor-pointer md:left-[-20px]
            sm:hidden
        `}
      >
        <ChevronLeft size={40} fill="black" />
      </div>
    );
  }

  // ✅ Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplaySpeed: 2500,
    slidesToShow: 6,
    slidesToScroll: 2,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 5, slidesToScroll: 2 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false }, // ✅ hide arrows on mobile
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false }, // ✅ hide arrows on smaller screens
      },
    ],
  };

  return (
    <div className="bg-[#f5f5f7] py-12 overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4">
        <h2 className="text-center text-[26.5px] font-[500] mb-2">
          Shop By Category
        </h2>
        <p className="text-center text-[#717182] text-[16px] mb-8">
          Browse our wide selection of local products organized by category
        </p>

        <Slider {...settings}>
          {data?.map((item, index) => (
            <div key={index} className="px-2">
              <CategoryItem
                Categoryname={item.Categoryname}
                no_of_items={item.no_of_items}
                img_link={item.img_link}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};