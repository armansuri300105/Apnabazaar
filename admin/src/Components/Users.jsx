import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../API/product";

export default function UsersManagement() {
  const [input, setInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    select: (res) => res.data || null,
  });

  useEffect(() => {
    if (data?.users) {
      setAllUsers(data.users);
      setUsers(data.users);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleSearchUser = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setUsers(allUsers); // show all again if input is empty
      return;
    }

    const searchResult = allUsers.filter((u) =>
      u?.name?.toLowerCase().includes(input.toLowerCase())
    );
    setUsers(searchResult);
  };
  return (
    <div className="p-4 sm:p-5 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Users Management</h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Manage customer accounts and user data
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-xs sm:text-sm">Total Users</h3>
          <p className="text-xl sm:text-2xl font-bold">{users.length}</p>
          <span className="text-xs text-green-600">+12% from last month</span>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-xs sm:text-sm">Avg Spent</h3>
          <p className="text-xl sm:text-2xl font-bold">
            ₹
            {users.length
              ? Math.floor(
                  users.reduce((sum, u) => sum + (u.totalSpent || 0), 0) / users.length
                ).toFixed(2)
              : 0}
          </p>
          <span className="text-xs text-gray-500">Per user lifetime value</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <form
          onSubmit={handleSearchUser}
          className="flex items-center bg-white px-2 sm:px-3 py-2 rounded-lg shadow-sm flex-grow"
        >
          <Search size={18} className="text-gray-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="ml-2 w-full outline-none text-xs sm:text-sm"
          />
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm overflow-x-scroll">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-2 sm:p-3">User</th>
              <th className="p-2 sm:p-3">Contact</th>
              <th className="p-2 sm:p-3">Orders</th>
              <th className="p-2 sm:p-3">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                    <img
                      src={u?.avatar || `/profile.webp`}
                      alt={u.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-xs sm:text-sm">{u.name}</p>
                      <p className="text-gray-500 text-[10px] sm:text-xs">
                        Joined {u.createdAt}
                      </p>
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                    <p>{u.email}</p>
                    <p className="text-gray-500">{u.phone}</p>
                  </td>
                  <td className="p-2 sm:p-3">{u?.orders?.length}</td>
                  <td className="p-2 sm:p-3">{parseFloat(u?.totalSpent.toFixed(2))!==0 ? `₹${Math.floor(u?.totalSpent)}` : "NA"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}