import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button - Fixed Position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-2 z-50 p-1 bg-black text-white rounded-lg shadow-lg hover:bg-gray-100 hover:text-black left-3`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-6 space-y-4 transform transition-transform duration-300 z-40 shadow-lg
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-xl font-bold mt-[20px]">
          Admin Panel
        </h2>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/"
            className="hover:bg-gray-100 rounded-lg p-2 transition"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/products"
            className="hover:bg-gray-100 rounded-lg p-2 transition"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/orders"
            className="hover:bg-gray-100 rounded-lg p-2 transition"
            onClick={() => setIsOpen(false)}
          >
            Orders
          </Link>
          <Link
            to="/vendors"
            className="hover:bg-gray-100 rounded-lg p-2 transition"
            onClick={() => setIsOpen(false)}
          >
            Vendors
          </Link>
          <Link
            to="/users"
            className="hover:bg-gray-100 rounded-lg p-2 transition"
            onClick={() => setIsOpen(false)}
          >
            Users
          </Link>
        </nav>
      </div>
    </>
  );
}