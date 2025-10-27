import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import Loading from "../../Loading/loading"

export default function OrderCard({ order, refetch, onUpdateStatus, setIsOpenDetail }) {
    const [status, setStatus] = useState(order.orderStatus);
    const [loading, setLoading] = useState(false);

    // Determine if the order is in a final, unchangeable state (Delivered or Cancelled)
    const isFinalStatus = status === "Delivered" || status === "Cancelled" || status === "Canceled"; 
    const isCancelled = status === "Cancelled" || status === "Canceled";

    const handleStatusChange = async () => {
        setLoading(true);
        
        let nextStatus;
        if (status === "Processing") {
            nextStatus = "Shipped";
        } else if (status === "Shipped") {
            nextStatus = "Delivered";
        } else {
            // Should not happen if button is disabled/hidden, but safe fallback
            nextStatus = status; 
        }

        try {
            // Call the parent function to update status on the backend
            await onUpdateStatus(order._id, nextStatus);
            // Update local state only if the API call was successful
            setStatus(nextStatus);
            
            // Refetch data for the parent list if needed, uncomment if refetch is mandatory after update
            // if (refetch) refetch(); 
        } catch (error) {
            console.error("Failed to update order status:", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    // Conditional CSS classes
    const statusColor = isCancelled ? "text-red-600 font-bold" : 
                        status === "Delivered" ? "text-green-600" : "text-blue-600";
    
    const cardBorderClass = isCancelled ? "border-2 border-red-500" : "border-none";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div 
                className={`bg-white relative w-[600px] rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[90vh] ${cardBorderClass}`}
            >
                {/* Close Button */}
                <IoMdClose 
                    onClick={() => setIsOpenDetail(false)} 
                    className="cursor-pointer absolute right-[10px] top-[10px] text-xl hover:text-gray-700"
                />
                
                <h1 className="text-2xl font-extrabold mb-4">Order #{order.orderId}</h1>

                {/* Status Indicator */}
                <div className="text-lg mb-4">
                    <span className="font-semibold">Order Status:</span> 
                    <span className={`ml-2 ${statusColor}`}>{status}</span>
                    {isCancelled && <span className="ml-2 text-red-500 text-sm">(Final)</span>}
                </div>

                {/* --- Customer Info --- */}
                <h2 className="text-xl font-bold mb-2">Customer Details</h2>
                <p><span className="font-semibold">Name:</span> {order.shippingAddress?.name}</p>
                <p><span className="font-semibold">Email:</span> {order.shippingAddress?.email}</p>
                <p><span className="font-semibold">Phone:</span> {order.shippingAddress?.phone}</p>
                <p><span className="font-semibold">Address:</span> 
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}, 
                    {order.shippingAddress?.state} - {order.shippingAddress?.zipcode}
                </p>

                {/* --- Items --- */}
                <h2 className="text-xl font-bold mt-4 mb-2">Ordered Items</h2>
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 border rounded-lg p-3 mb-2 bg-gray-50">
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

                {/* --- Payment Info --- */}
                <h2 className="text-xl font-bold mt-4 mb-2">Payment</h2>
                <p><span className="font-semibold">Method:</span> {order.paymentMethod}</p>
                <p><span className="font-semibold">Status:</span> {order.paymentStatus}</p>
                <p><span className="font-semibold">Total:</span> ₹{order.vendorTotal}</p>

                {/* --- Order Status Update Section (Hidden if Final Status) --- */}
                {!isFinalStatus && (
                    <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <p className="font-semibold">
                            Action: 
                        </p>
                        <button
                            disabled={loading}
                            onClick={handleStatusChange}
                            className={`px-4 py-2 rounded-xl text-white font-medium transition-colors ${loading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {loading ? (
                                <>Updating...</> // You can replace this with your actual Loading component if needed
                            ) : status === "Processing"
                            ? "Mark as Shipped"
                            : "Mark as Delivered"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}