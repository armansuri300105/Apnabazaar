import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const ordersData = [
    { day: "Aug 20", orders: 12 },
    { day: "Aug 21", orders: 15 },
    { day: "Aug 22", orders: 8 },
    { day: "Aug 23", orders: 10 },
    { day: "Aug 24", orders: 18 },
    { day: "Aug 25", orders: 20 },
    { day: "Aug 26", orders: 16 },
  ];

  const categoryData = [
    { name: "Produce", value: 35 },
    { name: "Bakery", value: 25 },
    { name: "Dairy", value: 20 },
    { name: "Preserves", value: 10 },
    { name: "Others", value: 10 },
  ];

  const vendorSales = [
    { name: "Green Valley", sales: 4500 },
    { name: "Baker's Corner", sales: 3200 },
    { name: "Sunny Side", sales: 2800 },
    { name: "Bee Happy", sales: 2300 },
  ];

  const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"];

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Orders Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#4ade80" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Sales by Category</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Top Vendors by Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendorSales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}