import { Truck } from "lucide-react";
import dayjs from "dayjs"

export default function OrderDetails({orderData}) {
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
    </div>
  );
}
