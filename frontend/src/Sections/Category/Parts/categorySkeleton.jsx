const CategorySkeleton = () => {
  return (
    <div className="flex gap-[20px] mt-[150px] ml-[50px]">
      {/* Left category skeleton */}
      <div>
        <div className="w-28 h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="px-3 flex justify-between items-center w-[15vw] h-[41px] rounded-lg mb-2 bg-gray-300 animate-pulse"
          >
            <div className="w-16 h-3 bg-gray-400 rounded"></div>
            <div className="h-5 w-5 rounded-lg bg-gray-400"></div>
          </div>
        ))}
      </div>

      {/* Right products skeleton */}
      <div className="flex-1">
        <div className="w-32 h-4 bg-gray-300 rounded mb-3 animate-pulse"></div>
        <div className="flex gap-6 mt-2 flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-[180px] h-[220px] bg-gray-300 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySkeleton;
