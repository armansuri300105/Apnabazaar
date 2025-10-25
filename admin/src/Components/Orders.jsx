import { useState } from "react";
import { Search, Filter, CheckCircle, Clock, Package, EyeIcon, Ban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../API/product";
import OrderCard from "./orderDetail"

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {data, isLoading} = useQuery({
    queryKey: [`orders`],
    queryFn: getAllOrders,
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
  const orders = data.orders

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "Pending").length,
    processing: orders.filter((o) => o.orderStatus === "Processing").length,
    completed: orders.filter((o) => o.orderStatus === "Delivered").length,
    cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "All" || o.orderStatus === statusFilter;
    const matchesSearch =
      o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const onUpdateStatus = async (id, nextStatus) => {
    
  }

  return (
    <div className="p-4 md:p-6">
      {isOpenDetail ? <OrderCard order={selectedOrder} setIsOpenDetail={setIsOpenDetail} onUpdateStatus={onUpdateStatus} /> : ""}
      {/* Header */}
      <h2 className="text-xl md:text-2xl font-bold mb-2">Orders Management</h2>
      <p className="text-gray-500 mb-6 text-sm md:text-base">
        Track and manage customer orders
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 md:p-4 rounded-xl border bg-white shadow">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-2xl font-bold">{stats?.total}</span>
            <Package className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
        <div className="p-3 md:p-4 rounded-xl border bg-white shadow">
          <p className="text-gray-500 text-sm">Pending</p>
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-2xl font-bold">{stats?.pending}</span>
            <Clock className="text-yellow-500 w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
        <div className="p-3 md:p-4 rounded-xl border bg-white shadow">
          <p className="text-gray-500 text-sm">Processing</p>
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-2xl font-bold">{stats?.processing}</span>
            <Package className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
        <div className="p-3 md:p-4 rounded-xl border bg-white shadow">
          <p className="text-gray-500 text-sm">Completed</p>
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-2xl font-bold">{stats?.completed}</span>
            <CheckCircle className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
        <div className="p-3 md:p-4 rounded-xl border bg-white shadow">
          <p className="text-gray-500 text-sm">Cancelled</p>
          <div className="flex items-center justify-between">
            <span className="text-lg md:text-2xl font-bold">{stats?.cancelled}</span>
            <Ban className="text-red-500 w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 mb-4">
        <div className="flex items-center border rounded-lg px-3 w-full bg-white">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          <input
            placeholder="Search orders, customers..."
            className="p-2 w-full outline-none text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 bg-white text-sm md:text-base"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button className="flex items-center justify-center gap-1 border rounded-lg px-3 py-2 bg-white text-sm md:text-base">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Orders Table (desktop) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o?._id} className="border-t">
                <td className="p-3 font-medium">{o?._id}</td>
                <td className="p-3">
                  <p>{o?.user?.name}</p>
                  <p className="text-sm text-gray-500">{o?.user?.email}</p>
                </td>
                <td className="p-3">{o?.createdAt}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      o?.orderStatus === "Completed"
                        ? "bg-green-100 text-green-700"
                        : o?.orderStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : o?.orderStatus === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {o?.orderStatus}
                  </span>
                </td>
                <td className="p-3 font-semibold">₹{o?.totalAmount?.toFixed(2)}</td>
                <td onClick={() => {setIsOpenDetail(true); setSelectedOrder(o)}} className="p-3 text-blue-600 cursor-pointer flex gap-[7px]"><EyeIcon className="w-[14px]"/> View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {filteredOrders.map((o) => (
          <div
            key={o.id}
            className="border rounded-xl bg-white shadow p-3 space-y-1"
          >
            <div className="flex justify-between">
              <span className="font-semibold">{o._id}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  o?.orderStatus === "Completed"
                    ? "bg-green-100 text-green-700"
                    : o?.orderStatus === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : o?.orderStatus === "Processing"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {o?.orderStatus}
              </span>
            </div>
            <p className="text-sm">{o?.user?.name}</p>
            <p className="text-xs text-gray-500">{o?.user?.email}</p>
            <p className="text-sm">📅 {o?.createdAt}</p>
            <p className="text-sm font-bold">💰 ₹{o?.totalAmount?.toFixed(2)}</p>
            <button onClick={() => {setIsOpenDetail(true); setSelectedOrder(o)}} className="text-blue-600 text-sm mt-1 flex gap-[7px]"><EyeIcon className="w-[14px]"/> View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
