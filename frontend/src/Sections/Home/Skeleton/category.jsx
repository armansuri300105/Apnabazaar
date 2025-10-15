const CategorySectionSkeleton = () => {
  return (
    <div className="bg-[#f5f5f7] pt-[42px] pb-[42px] animate-pulse">
      <div className="flex justify-center mb-[14px]">
        <div className="h-7 w-48 bg-gray-300 rounded-md"></div>
      </div>

      <div className="flex justify-center">
        <div className="h-4 w-64 bg-gray-300 rounded-md"></div>
      </div>

      <div className="mt-8 flex gap-4 justify-center flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-[180px] h-[220px] rounded-xl bg-white shadow-md p-4 flex flex-col items-center"
          >
            <div className="w-[120px] h-[120px] bg-gray-300 rounded-lg mb-4"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySectionSkeleton;