const PersonalSkeleton = () => {
  return (
    <>
      <div className="w-full mt-10 p-6 border rounded-2xl shadow-sm animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-40 bg-gray-300 rounded"></div>
            <div className="h-8 w-20 bg-gray-300 rounded-lg"></div>
        </div>

        {/* Form Skeleton */}
        <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>
            </div>

            <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>

            <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>
        </div>
        </div>
    </>
  )
}

export default PersonalSkeleton
