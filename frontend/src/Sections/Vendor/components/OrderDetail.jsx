import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import Loading from "../../Loading/loading"

export default function OrderCard({ order, refetch, onUpdateStatus, setIsOpenDetail }) {
  const [status, setStatus] = useState(order.orderStatus);
  const [loading, setLoading] = useState(false);
  const handleStatusChange = async () => {
    setLoading(true);
    let nextStatus =
      status === "Processing"
        ? "Shipped"
        : status === "Shipped"
        ? "Delivered"
        : "Delivered";
    await onUpdateStatus(order._id, nextStatus);
    setStatus(nextStatus);
    setLoading(false)
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white relative w-[600px] rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        {/* Customer Info */}
        <IoMdClose onClick={() => setIsOpenDetail(false)} className="cursor-pointer absolute right-[10px] top-[10px] text-xl"/>
        <h2 className="text-xl font-bold mb-2">Customer Details</h2>
        <p><span className="font-semibold">Name:</span> {order.shippingAddress?.name}</p>
        <p><span className="font-semibold">Email:</span> {order.shippingAddress?.email}</p>
        <p><span className="font-semibold">Phone:</span> {order.shippingAddress?.phone}</p>
        <p><span className="font-semibold">Address:</span> 
          {order.shippingAddress?.street}, {order.shippingAddress?.city}, 
          {order.shippingAddress?.state} - {order.shippingAddress?.zipcode}
        </p>

        {/* Items */}
        <h2 className="text-xl font-bold mt-4 mb-2">Ordered Items</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 border rounded-lg p-3 mb-2">
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p>Price: ₹{item.product.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}

        {/* Payment Info */}
        <h2 className="text-xl font-bold mt-4 mb-2">Payment</h2>
        <p><span className="font-semibold">Method:</span> {order.paymentMethod}</p>
        <p><span className="font-semibold">Status:</span> {order.paymentStatus}</p>
        <p><span className="font-semibold">Total:</span> ₹{order.totalAmount}</p>

        {/* Order Status */}
        <div className="mt-6 flex items-center justify-between">
          <p className="font-semibold">
            Current Status: <span className="text-blue-600">{status}</span>
          </p>
          <button
            disabled={order.orderStatus === "Delivered" ? true : false}
            onClick={handleStatusChange}
            className={`px-4 py-2 rounded-xl text-white disabled:bg-blue-300 disabled:cursor-not-allowed ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Updating..." : status === "Processing"
              ? "Mark as Shipped"
              : status === "Shipped"
              ? "Mark as Delivered"
              : "Delivered"}
          </button>
        </div>
      </div>
    </div>
  );
}