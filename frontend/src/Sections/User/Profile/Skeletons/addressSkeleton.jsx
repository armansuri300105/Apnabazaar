const AddressSkeleton = () => {
  return (
    <>
      <div className="w-full animate-pulse">
        <div className="flex justify-between items-center mb-4">
            <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
            <div
                key={i}
                className="border rounded-2xl p-4 min-w-[280px] bg-white shadow"
            >
                <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-56 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-44 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-36 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>

                <div className="flex justify-end gap-2">
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
            ))}
        </div>
        </div>
    </>
  )
}

export default AddressSkeleton
