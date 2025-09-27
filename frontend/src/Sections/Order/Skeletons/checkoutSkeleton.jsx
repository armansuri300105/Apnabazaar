const CheckoutSkeleton = () => {
  return (
    <section className="min-h-screen flex justify-center bg-[#f3f3f5] animate-pulse">
      <div className="checkout-section w-[1200px] relative flex gap-[30px] p-[30px] mt-[50px]">
        {/* LEFT SIDE */}
        <div className="checkout-section-left flex flex-col gap-[30px] w-[600px]">
          {/* Header */}
          <div className="flex gap-[20px] items-center">
            <div className="w-[24px] h-[24px] rounded-full bg-gray-300"></div>
            <div className="flex flex-col gap-2">
              <div className="w-[120px] h-[18px] bg-gray-300 rounded"></div>
              <div className="w-[200px] h-[14px] bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Steps */}
          <div className="flex max-w-[80vw] gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-[27px] h-[27px] bg-gray-300 rounded-full"></div>
                {index !== 2 && <div className="w-[80px] h-[2px] bg-gray-200"></div>}
              </div>
            ))}
          </div>

          {/* Address Section */}
          <div className="w-full h-[120px] bg-gray-200 rounded-lg"></div>

          {/* Delivery Option */}
          <div className="w-full h-[80px] bg-gray-200 rounded-lg"></div>

          {/* Payment Option */}
          <div className="w-full h-[100px] bg-gray-200 rounded-lg"></div>
        </div>

        {/* RIGHT SIDE (Order Detail) */}
        <div className="flex-1 h-[400px] bg-gray-200 rounded-lg"></div>
      </div>
    </section>
  );
};

export default CheckoutSkeleton