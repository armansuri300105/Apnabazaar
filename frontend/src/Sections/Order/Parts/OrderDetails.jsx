import { Truck } from "lucide-react";
import dayjs from "dayjs"

export default function OrderDetails({orderData}) {
  console.log(orderData)
  return (
    <div className="orderdetail-page w-[48%] max-w-md bg-white shadow-md rounded-xl p-5 space-y-4 border">
      <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
        <Truck className="w-5 h-5" />
        <span>Order Details</span>
      </div>

      <div>
        <p className="text-gray-500 text-xs sm:text-sm">Order Number</p>
        <div className="flex items-center gap-2 text-gray-800 text-sm sm:text-base">
          <span>{orderData?.orderId}</span>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-xs sm:text-sm">Order Date</p>
        <p className="text-gray-800 leading-6 text-sm sm:text-base">{dayjs(orderData?.createdAt).format("DD MMM YYYY, hh:mm A")}</p>
      </div>

      <div>
        <p className="text-gray-500 text-xs sm:text-sm">Total</p>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium">
          {orderData?.totalAmount}
        </span>
      </div>

      <div>
        <p className="text-gray-500 text-xs sm:text-sm">Payment</p>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium">
          {orderData?.paymentMethod}, {orderData?.paymentStatus}
        </span>
      </div>

      <button className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition flex justify-center items-center gap-2 text-sm sm:text-base">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
        Download Receipt
      </button>
    </div>
  );
}
