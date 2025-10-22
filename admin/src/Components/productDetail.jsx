import { useState } from "react";
import { updateProjectStatus } from "../../API/product";
import Swal from "sweetalert2"

const ProductDetail = ({ product, setView }) => {
  const [loader, setLoader] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false)
  if (!product) return null;

  const handleApprove = async () => {
    setApproveLoading(true);
    const res = await updateProjectStatus({product_id: product._id, status: "Approved"})
    if (res?.data?.success){
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product Approved Successfully",
            timer: 2000,
            showConfirmButton: false,
        });
    }
    setApproveLoading(false)
  };

  const handleReject = async () => {
    setLoader(true)
    const res = await updateProjectStatus({product_id: product._id, status: "Rejected"})  
    if (res?.data?.success){
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product is Rejected",
            timer: 2000,
            showConfirmButton: false,
        });
    }
    setLoader(false)
  };

  const renderBoldItalic = (text) => {
    let html = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    html = html.replace(/\*(.*?)\*/g, "<i>$1</i>");
    html = html.replace(/\n/g, "<br/>");
    return html;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] md:w-[600px] p-6 relative h-[80vh] overflow-y-scroll">
        {/* Close Button */} 
        <button
          onClick={() => setView(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          ✕
        </button>

        {/* Product Images */}
        <div className="flex gap-2 overflow-x-auto mb-4 mt-[40px]">
          {product.images && product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Product ${idx}`}
                className="h-32 w-32 object-cover rounded-lg border"
              />
            ))
          ) : (
            <div className="text-gray-500 italic">No images available</div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {product.name}
          </h2>
          <p className="text-gray-700">
            <span className="font-semibold">Price:</span> ₹{product.price.toFixed(2)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Stock:</span> {product.stock}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-white text-sm ${
                product.status === "Approved"
                  ? "bg-green-600"
                  : product.status === "Rejected" || product.status === "Deleted"
                  ? "bg-red-600"
                  : "bg-gray-500"
              }`}
            >
              {product.status}
            </span>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Active:</span>{" "}
            {product.isActive ? (
              <span className="text-green-600 font-medium">Yes</span>
            ) : (
              <span className="text-red-600 font-medium">No</span>
            )}
          </p>
          <div className="text-gray-700">
            <span className="font-bold text-xl">Description:</span>{" "}
            <div
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: renderBoldItalic(product?.description || "") }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {product.status==="Pending" ? <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            {loader ? "Updating.." : "Reject"}
          </button>
          <button
            onClick={handleApprove}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            {approveLoading ? "Updating..." : "Approve"}
          </button>
        </div> : ""}
      </div>
    </div>
  );
};

export default ProductDetail;