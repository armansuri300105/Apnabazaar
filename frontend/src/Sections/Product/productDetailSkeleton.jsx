const ProductDetailSkeleton = () => {
  return (
    <>
      <section className="product-detail w-screen flex flex-col items-center animate-pulse">
        <div className="product-detail-section w-[1200px] mt-[120px] mx-auto grid grid-cols-2 gap-10 p-6">
            {/* Back Button */}
            <div className="cursor-pointer col-span-2 flex gap-[10px] items-center">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            </div>

            {/* Left Section (Images) */}
            <div className="product-detail-section-left">
            <div className="w-full h-[400px] bg-gray-200 rounded-2xl shadow-md"></div>
            <div className="flex flex-wrap gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
            </div>
            </div>

            {/* Right Section (Details) */}
            <div className="product-detail-section-right space-y-4">
            <div className="flex justify-between items-center">
                <div className="w-48 h-6 bg-gray-300 rounded"></div>
                <div className="flex gap-[10px]">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                </div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
                ))}
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
                <div className="w-16 h-5 bg-gray-300 rounded"></div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
                <div className="w-11/12 h-4 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
            </div>

            {/* Delivery Info */}
            <div className="p-3 bg-[#ececf0c0] rounded-md flex items-center gap-[10px]">
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
                <div>
                <div className="w-48 h-4 bg-gray-300 rounded"></div>
                <div className="w-40 h-3 bg-gray-200 rounded mt-1"></div>
                </div>
            </div>

            {/* Quantity + Button */}
            <div className="product-detail-section-btns flex items-center justify-between">
                <div className="flex flex-col gap-[10px]">
                <div className="w-20 h-4 bg-gray-300 rounded"></div>
                <div className="flex items-center gap-2">
                    <div className="w-[30px] h-[30px] bg-gray-200 rounded-md"></div>
                    <div className="w-[50px] h-[20px] bg-gray-200 rounded"></div>
                    <div className="w-[30px] h-[30px] bg-gray-200 rounded-md"></div>
                </div>
                </div>
                <div className="bg-gray-300 rounded-md w-[350px] h-[30px]"></div>
            </div>
            <div className="w-32 h-4 bg-gray-200 rounded mt-2"></div>
            </div>
        </div>

        {/* Other Details */}
        <div className="other-details w-[1200px] mt-[70px] relative">
            <div className="w-fit rounded-xl bg-[#ececf0] p-[5px] flex justify-between mb-[20px] gap-3">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="w-20 h-6 bg-gray-300 rounded-xl"></div>
            ))}
            </div>
            <div className="w-full h-[200px] bg-gray-200 rounded-xl"></div>
            <div className="w-[200px] h-[24px] bg-gray-300 rounded mt-[40px] mb-[20px]"></div>
        </div>
        <div className="flex flex-wrap gap-[20px] justify-center animate-pulse">
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
        </div>
       </section>
    </>
  )
}

export default ProductDetailSkeleton
