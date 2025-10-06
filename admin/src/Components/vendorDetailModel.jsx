import { X, Mail, Phone, MapPin, Package, Star, IndianRupee, Calendar, FileText } from "lucide-react";
import { approveVendor } from "../../API/product";

export default function VendorDetailsModal({ vendor, isOpen, onClose }) {
  if (!isOpen || !vendor) return null;
    const handleApprove = async () => {
        try {
            const res = await approveVendor(vendor._id)
            if (res.data.success){
                alert("Vendor is Now Approved")
                onClose();
            }
            else alert("Something went wrong")
        } catch (error) {
            console.log(error.message)
        }
    }
  console.log(vendor)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Vendor Header */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">{vendor?.vendor?.companyName}</h2>
            <p className="text-gray-600">{vendor.description}</p>
            <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700">
              {vendor?.vendor?.status}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 my-6 text-center">
          <div>
            <Package className="mx-auto text-blue-500" />
            <p className="font-semibold">{vendor?.vendor?.products.length}</p>
            <p className="text-sm text-gray-500">Products</p>
          </div>
          <div>
            <Star className="mx-auto text-yellow-500" />
            <p className="font-semibold">{vendor?.vendor?.rating}</p>
            <p className="text-sm text-gray-500">{vendor.reviews} Reviews</p>
          </div>
          <div>
            <IndianRupee className="mx-auto text-green-500" />
            <p className="font-semibold">₹{vendor?.vendor?.totalSales}</p>
            <p className="text-sm text-gray-500">Total Sales</p>
          </div>
          <div>
            <Calendar className="mx-auto text-purple-500" />
            <p className="font-semibold">{vendor?.vendor?.appliedAt
                ? new Date(vendor.vendor.appliedAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "N/A"}
            </p>
            <p className="text-sm text-gray-500">Join Date</p>
          </div>
        </div>

        {/* Contact Info */}
        <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-600" />
            <span>{vendor?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-600" />
            <span>{vendor?.phone}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin size={16} className="text-gray-600" />
            <span>{vendor?.vendor?.address}</span>
          </div>
        </div>

        {/* Documents */}
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        <div className="flex gap-2 mb-6">
          {vendor.documents?.map((doc, i) => (
            <span
              key={i}
              className="px-3 py-1 text-sm bg-gray-100 rounded-md flex items-center gap-1"
            >
              <FileText size={14} /> {doc}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Suspend
          </button>
          {vendor?.vendor?.status === "Pending" ? <button onClick={handleApprove} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            Approve the application
          </button> : ""}
        </div>
      </div>
    </div>
  );
}