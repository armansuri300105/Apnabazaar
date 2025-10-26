import { useContext } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { CartProductContext } from "../../../services/context";
import { useQuery } from "@tanstack/react-query";
import { getlast7daysorders, getordersbycategory } from "../../../../API/api";
import NotificationPanel from "./notificationPannel";

const Dashboard = ({handleLogout, setSelectedField}) => {
  const { user, loadinguser } = useContext(CartProductContext);

  const {data: ordersData} = useQuery({
    queryKey: ["last7days"],
    queryFn: getlast7daysorders,
    select: (res) => res?.data?.data || []
  })

  const {data: salesCategory, isLoading: loading} = useQuery({
    queryKey: ["salebycat"],
    queryFn: getordersbycategory,
    select: (res) => res?.data?.data || []
  })

  
  if (loadinguser || loading){
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const COLORS = Array.from(
    { length: salesCategory.length },
    () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`
  );
  return (
    <>
      <div className="p-6 space-y-6 transition-all mt-[20px] duration-300 bg-gray-50 w-full">
        <div className="vendor-dashboard flex sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex flex-wrap gap-2">
            <NotificationPanel setSelectedField={setSelectedField}/>
            <button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg">
                Logout
            </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-xl p-4">
              <h2 className="text-lg font-semibold">Total Orders</h2>
              <p className="text-3xl font-bold mt-2">{user?.vendor?.totalOrders}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4">
              <h2 className="text-lg font-semibold">Total Revenue</h2>
              <p className="text-3xl font-bold mt-2">₹{user?.vendor?.totalRevenue}</p>
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
       </div>
    </>
  )
}

export default Dashboard