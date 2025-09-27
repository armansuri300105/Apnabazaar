const FooterSkeleton = () => {
  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 px-6">
        <div className="footer-grid max-w-7xl mx-auto grid grid-cols-4 gap-12 p-[50px] animate-pulse">
            {/* Logo + description */}
            <div>
            <div className="h-8 w-36 bg-gray-200 rounded mb-[25px]"></div>
            <div className="space-y-2 mb-4">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
            </div>
            <div className="flex space-x-4">
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
            </div>

            {/* Quick Links */}
            <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-28 bg-gray-200 rounded"></div>
                ))}
            </div>
            </div>

            {/* Categories */}
            <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-28 bg-gray-200 rounded"></div>
                ))}
            </div>
            </div>

            {/* Stay Updated */}
            <div>
            <div className="h-4 w-28 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-2 mb-4">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
            </div>
            <div className="flex flex-col gap-2 mb-3">
                <div className="h-9 w-full bg-gray-200 rounded"></div>
                <div className="h-9 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-40 bg-gray-200 rounded"></div>
                <div className="h-3 w-28 bg-gray-200 rounded"></div>
            </div>
            </div>
        </div>

        {/* Copyright */}
        <div className="copyright max-w-7xl mx-auto flex justify-between items-center mb-[10px] mt-10 pt-6 border-t border-gray-200 text-xs animate-pulse">
            <div className="h-3 w-40 bg-gray-200 rounded"></div>
            <div className="flex space-x-4">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
        </div>
        </footer>
    </>
  )
}

export default FooterSkeleton
