import { useQuery } from "@tanstack/react-query";
import { Clock, Truck, CheckCircle, Package } from "lucide-react";
import { cancelOrder, getOrderById } from "../../../API/api";
import { useNavigate, useParams } from "react-router-dom";
import "./checkout.css"
import CancelForm from "./cancelForm"

export default function TrackOrder() {
    const {orderId} = useParams();
    const navigate = useNavigate();
    const {data, isLoading, refetch} = useQuery({
        queryKey: ["order"],
        queryFn: () => getOrderById(orderId),
        select: (res) => res?.data || null
    })

    if (isLoading){
        return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading...</p>
            </div>
        </div>
        );
    }

    const order = data?.order;
    
    const placedDate = order?.createdAt ? new Date(order.createdAt) : null;
    const placedDateFormatted = placedDate
    ? placedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

    const estimatedDelivery = placedDate
    ? new Date(placedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    : null;

    const estimatedDeliveryFormatted = estimatedDelivery
    ? estimatedDelivery.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 mt-[93px]">
      <div className="w-full max-w-3xl space-y-6">
        {/* Back to Orders */}
        <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:underline">← Back to Orders</button>

        {order.orderStatus === "Cancelled" ? 
          <div className="text-red-500 text-xl font-bold">
            Cancelled
          </div> : ""
        }
        {/* Order Info */}
        <div className="bg-white shadow rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-gray-800">Order {order?.orderId}</h2>
              <p className="text-sm text-gray-500">Placed on {placedDateFormatted}</p>

              <div className="mt-4">
                <h3 className="font-medium text-gray-700">Shipping Address</h3>
                <p className="text-sm text-gray-600 leading-5">
                  {order?.shippingAddress?.street} <br />
                  {order?.shippingAddress?.zipcode} <br />
                  {order?.shippingAddress?.state}
                </p>
              </div>
            </div>

            <div className="text-right">
              <h3 className="font-medium text-gray-700">Order Details</h3>
              <p className="text-sm text-gray-600">Total: {order?.totalAmount}</p>
              <p className="text-sm text-gray-600">Estimated Delivery: {estimatedDeliveryFormatted}</p>
              <div className="mt-2 bg-gray-100 p-2 rounded-xl inline-block">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="font-medium text-gray-700 mb-4">Order Progress</h3>
          <div className="track-order-details flex items-center justify-between">
            {/* Processing */}
            <div className={`flex flex-col items-center text-center ${
                ["Processing", "Shipped", "Delivered"].includes(order?.orderStatus)
                  ? "text-black"
                  : "text-gray-400"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-6 h-6" />
                <span className="font-medium">Processing</span>
              </div>
            </div>

            <div className="track-order-bars flex-1 border-t border-gray-300 mx-2"></div>

            {/* Shipped */}
            <div className={`flex flex-col items-center text-center ${
                ["Shipped", "Delivered"].includes(order?.orderStatus)
                  ? "text-black"
                  : "text-gray-400"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Truck className="w-6 h-6" />
                <span>Shipped</span>
              </div>
            </div>

            <div className="track-order-bars flex-1 border-t border-gray-300 mx-2"></div>

            {/* Delivered */}
            <div className={`flex flex-col items-center text-center ${
                order?.orderStatus === "Delivered" ? "text-black" : "text-gray-400"
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6" />
                <span>Delivered</span>
              </div>
            </div>

            {/* Cancelled */}
            {order?.orderStatus === "Cancelled" && (
              <>
                <div className="track-order-bars flex-1 border-t border-gray-300 mx-2"></div>
                <div className="flex flex-col items-center text-center text-red-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6" />
                    <span>Cancelled</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>


        {/* Items */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h3 className="font-medium text-gray-700 mb-4">Items in this Order</h3>
          <div className="flex flex-col gap-[20px]">
            {order?.items?.map((item, index) => {
              return (
              <div key={index} className="flex justify-between items-center border rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item?.product?.images[0]}
                    alt={item?.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{item?.name}</h4>
                    <p className="text-sm text-gray-500">{item?.category}</p>
                    <p className="text-sm text-gray-600">Quantity: {item?.quantity} × ₹{item?.product?.price}</p>
                  </div>
                </div>
                <p className="font-medium text-gray-800">₹{item?.product?.price}</p>
              </div>)
            })}
          </div>
        </div>
        {order.orderStatus=== "Cancelled" ? "" : <CancelForm orderId={orderId} refetch={refetch}/>}
      </div>
    </div>
  );
}