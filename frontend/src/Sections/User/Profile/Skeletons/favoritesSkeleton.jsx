const FavoritesSkeleton = () => {
  return (
    <section className="flex flex-wrap gap-[20px] justify-center animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="w-[200px] h-[280px] border rounded-2xl shadow-sm p-4 flex flex-col"
        >
          {/* Image placeholder */}
          <div className="w-full h-[150px] bg-gray-200 rounded-lg mb-4"></div>

          {/* Text placeholders */}
          <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded mb-4"></div>

          {/* Button placeholder */}
          <div className="h-8 w-full bg-gray-200 rounded-lg mt-auto"></div>
        </div>
      ))}
    </section>
  );
};

export default FavoritesSkeleton