import { useState } from "react";
import { Eye, CheckCircle, Clock, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getVendors } from "../../API/product";
import VendorDetailsModal from "./vendorDetailModel";

export default function Vendors() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [expandedVendor, setExpandedVendor] = useState(null);
  const {data, isLoading} = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
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

  const vendors = data?.vendors;
  console.log(vendors)
  // Toggle vendor details on mobile
  const toggleVendorDetails = (id) => {
    if (expandedVendor === id) {
      setExpandedVendor(null);
    } else {
      setExpandedVendor(id);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-5 lg:p-6">
      <VendorDetailsModal
        vendor={selectedVendor}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Vendors Management</h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Manage local vendors and their applications
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              className="pl-8 pr-3 py-2 border rounded-lg text-sm w-full sm:w-48 md:w-64"
            />
          </div>
          <button className="p-2 border rounded-lg flex items-center gap-1 text-sm">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        <div className="p-3 sm:p-4 rounded-xl border bg-white shadow col-span-2 sm:col-span-1">
          <p className="text-gray-500 text-xs sm:text-sm">Total Vendors</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold">{vendors.length}</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl border bg-white shadow">
          <p className="text-gray-500 text-xs sm:text-sm">Active</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold">
            {vendors?.filter((v) => v?.vendor?.status === "Active").length}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl border bg-white shadow">
          <p className="text-gray-500 text-xs sm:text-sm">Pending Approval</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold">
            {vendors?.filter((v) => v?.vendor?.status === "Pending").length}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl border bg-white shadow col-span-2 sm:col-span-1">
          <p className="text-gray-500 text-xs sm:text-sm">Total Products</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold">
            {vendors?.reduce((sum, v) => sum + v?.products, 0)}
          </p>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="rounded-xl border bg-white shadow overflow-hidden">
        {/* Table Header for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-3 text-left">Vendor</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Products</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-left">Sales</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{v?.name}</p>
                      <p className="text-sm text-gray-500">{v?._id}</p>
                    </div>
                  </td>
                  <td className="p-3">{v?.vendor?.address}</td>
                  <td className="p-3">
                    <span
                      className={`flex items-center gap-1 px-2 w-fit py-1 rounded-full text-sm font-medium ₹{
                        v?.vendor?.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {v?.vendor?.status === "Active" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                      {v?.vendor?.status}
                    </span>
                  </td>
                  <td className="p-3">{v?.vendor?.products?.length}</td>
                  <td className="p-3">
                    {v?.rating}{" "}
                    <span className="text-gray-400 text-sm">
                      ({v?.reviews})
                    </span>
                  </td>
                  <td className="p-3 font-semibold">
                    ₹{v?.vendor?.totalRevenue === 0 ? 0 : v?.vendor?.totalRevenue}
                  </td>
                  <td className="p-3">
                    <button onClick={() => {
                      setSelectedVendor(v);
                      setIsOpen(true);
                    }} className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden">
          {vendors.map((v, index) => (
            <div key={index} className="border-b last:border-b-0">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleVendorDetails(v._id)}
              >
                <div>
                  <p className="font-medium">{v?.name}</p>
                  <p className="text-sm text-gray-500">{v?._id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ₹{
                      v?.vendor?.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {v?.vendor?.status === "Active" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {v?.vendor?.status}
                  </span>
                  {expandedVendor === v.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
              
              {expandedVendor === v._id && (
                <div className="px-4 pb-4 pt-2 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">{v?.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-medium">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {v?.category}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Products</p>
                      <p className="font-medium">{v?.vendor?.products?.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rating</p>
                      <p className="font-medium">
                        {v.rating} <span className="text-gray-400">({v.reviews})</span>
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Sales</p>
                      <p className="font-medium">₹{v?.vendor?.totalRevenue === 0 ? 0 : v?.vendor?.totalRevenue}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        setSelectedVendor(v);
                        setIsOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1 text-blue-600 hover:underline text-sm py-2 border border-blue-200 rounded-lg">
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 