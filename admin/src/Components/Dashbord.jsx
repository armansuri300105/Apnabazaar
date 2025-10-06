import { useContext } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { CartProductContext } from "../services/context";
import { useNavigate } from "react-router-dom";
import { dashboardDetail, getLast7DaysOrders, getOrdersByCategory, getSalesByVendors, logout } from "../../API/product";
import {useQuery} from "@tanstack/react-query"

export default function Dashboard() {
  const navigate = useNavigate();
  const { setCheckAuth } = useContext(CartProductContext);

  const {data: last7days} = useQuery({
    queryKey: ["last7days"],
    queryFn: getLast7DaysOrders,
    select: (res) => res?.data?.data || null
  })

  const {data: sales} = useQuery({
    queryKey: ["salesCategory"],
    queryFn: getOrdersByCategory,
    select: (res) => res?.data || null
  })
  
  const {data: vendor} = useQuery({
    queryKey: ["vendor"],
    queryFn: getSalesByVendors,
    select: (res) => res?.data || null
  })

  const {data: detail} = useQuery({
    queryKey: ["detail"],
    queryFn: dashboardDetail,
    select: (res) => res?.data || null
  })

  console.log(detail)
  let salesCategory = [];
  if (sales?.success){
    salesCategory = sales?.data
  }

  let vendorSales = [];
  if (sales?.success){
    vendorSales = vendor?.data
  }
  
  const COLORS = Array.from(
    { length: salesCategory.length },
    () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`
  );

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res?.data?.success) {
        // Reset authentication state
        setCheckAuth(false);
        navigate("/signin");
      } else {
        console.error("Logout failed");
        // Force logout on frontend even if backend fails
        setCheckAuth(false);
        navigate("/signin");
      }
    } catch (error) {
      console.log("Logout error:", error);
      // Force logout on frontend even if there's an error
      setCheckAuth(false);
      navigate("/signin");
    }
  };
  console.log(salesCategory)
  return (
    <div className="p-6 space-y-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">Settings</button>
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">Notifications</button>
          <button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">{detail?.totalOrder}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold mt-2">₹{detail?.totalRevenue?.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold">Active Vendors</h2>
          <p className="text-3xl font-bold mt-2">{detail?.totalVendors}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Orders Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={last7days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={salesCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {salesCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">Top Vendors by Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendorSales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vendor" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}