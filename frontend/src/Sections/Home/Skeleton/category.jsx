import {CategoryItem} from "../Components/Categoryitem";

const CategorySection = ({ data, loading }) => {
  return (
    <div className="bg-[#f5f5f7] pt-[42px] pb-[42px]">
      <div>
        <div className="flex justify-center text-[26.5px] h-[32px] mb-[14px] font-[500]">
          Shop By Category
        </div>
        <div className="flex justify-center">
          <div className="text-[14px] h-[21px] text-[#717182] text-center">
            Browse our wide selection of local products organized by category
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          {!loading
            ? data?.map((item, index) => (
                <CategoryItem
                  key={index}
                  Categoryname={item.Categoryname}
                  no_of_items={item.no_of_items}
                  img_link={item.img_link}
                />
              ))
            : // Skeleton Loader
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[180px] h-[220px] rounded-xl bg-white shadow-md p-4 flex flex-col items-center animate-pulse"
                >
                  <div className="w-[120px] h-[120px] bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
