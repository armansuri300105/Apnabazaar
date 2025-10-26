import { Calendar, Truck } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Shipping({orderData}) {
  return (
    <div className="shipping-page w-[48%] bg-white shadow-md rounded-xl p-5 space-y-4 border">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Truck className="w-5 h-5" />
        <span>Shipping Information</span>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Estimated Delivery</p>
        <div className="flex items-center gap-2 text-gray-800">
          <Calendar className="w-4 h-4" />
          <span>Friday, August 29, 2025</span>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Shipping Address</p>
        <div className="text-gray-800 leading-6">
          <p>{orderData?.shippingAddress?.email}</p>
          <p>{orderData?.shippingAddress?.name}</p>
          <p>{orderData?.shippingAddress?.street}, {orderData?.shippingAddress?.city}, {orderData?.shippingAddress?.zipcode}</p>
          <p>{orderData?.shippingAddress?.state}</p>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Delivery Method</p>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
          {orderData?.deliveryMethod}
        </span>
      </div>

      <NavLink to={`/orders/${orderData?.orderId}`}><button className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
        Track Your Order
      </button></NavLink>
    </div>
  );
}
