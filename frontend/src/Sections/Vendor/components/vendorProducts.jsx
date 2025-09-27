import { useState } from "react";
import { Bell, Settings, LogOut, Plus, Eye, Edit, Trash, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getVendorProducts } from "../../../../API/api";
import AddProductForm from "./AddProduct";

const VendorProducts = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const {data, isLoading} = useQuery({
    queryKey: ["product"],
    queryFn: getVendorProducts,
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

  const products = data.products;
  console.log(products)

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-bold">Products Management</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-3/4 bg-white shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col space-y-4 mt-8">
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-red-600">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
              <button onClick={() => setAddProduct(true)} className={`flex items-center justify-center gap-2 p-3 text-white rounded-lg mt-4 ${addProduct ? `bg-red-500` : `bg-black`}`}>
                {!addProduct ? (
                  <>
                    <Plus className="w-4 h-4" /> Add Product
                  </>
                ) : (
                  "Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 w-full p-4 md:p-6 overflow-x-hidden">
        {/* 🔹 Top Bar - Enhanced for Responsiveness */}
        <div className="hidden lg:flex justify-between items-center gap-3 mb-6 w-full">
          <h2 className="text-2xl font-bold">Products Management</h2>
          <div className="flex gap-3 items-center">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-red-100 text-red-600">
              <LogOut className="w-5 h-5" />
            </button>
            <button onClick={() => setAddProduct(!addProduct)} className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg ${addProduct ? "bg-red-500" : "bg-black"}`}>
              {!addProduct ? (
                <>
                  <Plus className="w-4 h-4" /> Add Product
                </>
              ) : (
                "Cancel"
              )}
            </button>
          </div>
        </div>

        {/* 🔹 Summary Cards - Improved Grid for All Screens */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-xl md:text-2xl font-bold">{products.length}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-sm">In Stock</p>
            <p className="text-xl md:text-2xl font-bold">
              {products.filter((p) => p.stock > 0).length}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-sm">Out of Stock</p>
            <p className="text-xl md:text-2xl font-bold text-red-500">
              {products.filter((p) => p.stock <= 0).length}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-sm">Avg. Price</p>
            <p className="text-xl md:text-2xl font-bold">
              ₹
              {(
                products.reduce((acc, p) => acc + p.price, 0) / products.length
              ).toFixed(2)}
            </p>
          </div>
        </div>
        {addProduct ? <AddProductForm setAddProduct={setAddProduct} /> : ``}
        {/* 🔹 Mobile Product Cards for Small Screens */}
        <div className="lg:hidden grid grid-cols-1 gap-4 mb-6">
          {products.map((p, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{p.name}</h3>
                  <p className="text-xs text-gray-500">{p.vendor}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {p.category}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-bold">₹{p.price}{p.oldPrice && <span className="ml-2 line-through text-gray-400 text-xs">${p.oldPrice}</span>}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    parseInt(p.stock) > 0
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    {parseInt(p.stock) > 0 ? `In Stock` : `Out Of Stock`}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Rating</p>
                  <p>{p.rating} <span className="text-gray-400 text-xs">({p.reviews})</span></p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 Table for Medium and Large Screens */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 text-sm"
                >
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.vendor}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3">{p.vendor}</td>
                  <td className="p-3">
                    <span className="font-bold">₹{p.price}</span>
                    {p.oldPrice && (
                      <span className="ml-2 line-through text-gray-400 text-xs">
                        ${p.oldPrice}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      parseInt(p.stock) > 0
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {parseInt(p.stock) > 0 ? `In Stock` : `Out Of Stock`}
                  </span>
                  </td>
                  <td className="p-3">
                    {p.rating}{" "}
                    <span className="text-gray-400 text-xs">({p.reviews})</span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button className="flex items-center justify-center w-14 h-14 bg-black text-white rounded-full shadow-lg">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default VendorProducts