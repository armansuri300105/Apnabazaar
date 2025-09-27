import { useContext, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { CartProductContext } from "../services/context";
import { useNavigate } from "react-router-dom";
import { logout } from "../../API/product";

export default function Dashboard() {
  const navigate = useNavigate();
  const { setCheckAuth } = useContext(CartProductContext);

  const ordersData = [
    { date: "Aug 20", orders: 12 },
    { date: "Aug 21", orders: 15 },
    { date: "Aug 22", orders: 8 },
    { date: "Aug 23", orders: 10 },
    { date: "Aug 24", orders: 18 },
    { date: "Aug 25", orders: 20 },
    { date: "Aug 26", orders: 16 },
  ];

  const salesCategory = [
    { name: "Produce", value: 35 },
    { name: "Bakery", value: 25 },
    { name: "Dairy", value: 20 },
    { name: "Preserves", value: 10 },
    { name: "Others", value: 10 },
  ];

  const vendorSales = [
    { vendor: "Green Valley Farm", sales: 4500 },
    { vendor: "Baker's Corner", sales: 3200 },
    { vendor: "Sunny Side Farm", sales: 2800 },
    { vendor: "Bee Happy Apiary", sales: 2300 },
  ];

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AA66CC"];

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
          <p className="text-3xl font-bold mt-2">1,245</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold mt-2">$12,340</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold">Active Vendors</h2>
          <p className="text-3xl font-bold mt-2">45</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Orders Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ordersData}>
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