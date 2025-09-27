const OrdersSkeleton = () => {
  return (
    <>
      <section className="flex flex-col items-center">
        <div className="orders-page relative w-[1200px] mt-[120px] mb-[100px]">
            <div className="w-full mb-[20px]">
            <div className="px-2">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="flex items-center gap-2 bg-white border rounded-2xl shadow-sm p-2 m-2">
                <div className="flex items-center flex-1 bg-gray-100 rounded-md px-3 py-2">
                <div className="h-4 w-4 bg-gray-300 rounded animate-pulse mr-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-9 w-[100px] bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-9 w-[100px] bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            </div>

            <div className="w-full flex flex-col gap-4 items-center relative">
            {[...Array(3)].map((_, i) => (
                <div
                key={i}
                className="w-[100%] bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 border animate-pulse"
                >
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-40 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                </div>

                <div className="flex gap-[10px]">
                    {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-14 h-14 bg-gray-200 rounded-md"></div>
                    ))}
                </div>

                <div className="flex justify-between">
                    <div className="h-4 w-56 bg-gray-200 rounded"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    </>
  )
}

export default OrdersSkeleton
