import "../home.css"

const HeroSkeleton = () => {
  return (
    <div className="hero-top-seciton animate-pulse">
      {/* Hero Text */}
      <div className="hero-text hero-section-text text-[42px] text-[#070616] space-y-2">
        <div className="h-10 w-3/4 bg-gray-300 rounded-lg"></div>
        <div className="h-10 w-1/2 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Description */}
      <div className="hero-text mt-6">
        <div className="h-5 w-full bg-gray-200 rounded-lg"></div>
        <div className="h-5 w-5/6 bg-gray-200 rounded-lg mt-2"></div>
        <div className="h-5 w-4/6 bg-gray-200 rounded-lg mt-2"></div>
      </div>

      {/* Buttons */}
      <div className="home-buttons-div flex gap-4 mt-5">
        <div className="h-[35px] w-[114px] bg-gray-300 rounded-lg"></div>
        <div className="h-[35px] w-[141px] bg-gray-300 rounded-lg"></div>
      </div>

      {/* Icons Section */}
      <div className="hero-text quality-btns h-[98px] flex justify-between px-10 pt-10">
        <div className="space-y-2 flex flex-col items-center">
          <div className="h-[42px] w-[42px] bg-gray-300 rounded-lg"></div>
          <div className="h-3 w-20 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="space-y-2 flex flex-col items-center">
          <div className="h-[42px] w-[42px] bg-gray-300 rounded-lg"></div>
          <div className="h-3 w-24 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="space-y-2 flex flex-col items-center">
          <div className="h-[42px] w-[42px] bg-gray-300 rounded-lg"></div>
          <div className="h-3 w-16 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Right Side Image & Stats */}
      <div className="mt-10 flex items-center justify-center gap-6">
        {/* Left Stat */}
        <div className="hero-side-images-skeleton h-[76px] w-[105px] bg-gray-300 rounded-2xl"></div>
        {/* Hero Image */}
        <div className="hero-section-image-skeleton h-[399px] w-[532px] bg-gray-200 rounded-xl"></div>
        {/* Right Stat */}
        <div className="hero-side-images-skeleton h-[76px] w-[126px] bg-gray-300 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default HeroSkeleton;