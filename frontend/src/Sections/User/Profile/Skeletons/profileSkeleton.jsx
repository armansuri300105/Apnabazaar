const ProfileSkeleton = () => {
  return (
    <>
      <section className="min-h-screen bg-gray-50 flex justify-center">
        <div className="w-[1200px] p-6 mt-[120px]">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-6 animate-pulse">
            <div>
                <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-72 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-28 bg-gray-300 rounded-lg"></div>
            </div>

            {/* Profile Box Skeleton */}
            <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center mb-6 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-300"></div>
                <div>
                <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
                <div className="flex gap-4">
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                </div>
            </div>
            <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex bg-gray-100 rounded-lg overflow-hidden mb-6 p-[5px] animate-pulse gap-2">
            <div className="flex-1 h-9 bg-gray-300 rounded"></div>
            <div className="flex-1 h-9 bg-gray-300 rounded"></div>
            <div className="flex-1 h-9 bg-gray-300 rounded"></div>
            <div className="flex-1 h-9 bg-gray-300 rounded"></div>
            </div>

            {/* Content Skeleton */}
            <div className="bg-white shadow rounded-xl p-6 animate-pulse">
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            </div>
        </div>
        </section>
    </>
  )
}

export default ProfileSkeleton
