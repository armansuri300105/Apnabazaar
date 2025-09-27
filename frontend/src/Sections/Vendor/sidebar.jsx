import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar({setSelectedField}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🔹 Top Bar for Mobile */}
      <div className="min-[664px]:hidden flex items-center justify-between p-4 bg-white shadow-md">
        <h2 className="text-lg font-bold">Vendor Panel</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 🔹 Sidebar */}
      <div
        className={`fixed min-[664px]:static top-0 left-0 h-full w-64 bg-white p-6 space-y-4 transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} min-[664px]:translate-x-0`}
      >
        <h2 className="text-xl font-bold hidden min-[664px]:block">
          Vendor Panel
        </h2>
        <ul className="flex flex-col space-y-2">
          <li
            className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition"
            onClick={() => {setIsOpen(false); setSelectedField("dashboard");}}
          >
            Dashboard
          </li>
          <li
            className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition"
            onClick={() => {setIsOpen(false); setSelectedField("products");}}
          >
            Products
          </li>
          <li
            className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition"
            onClick={() => {setIsOpen(false); setSelectedField("orders");}}
          >
            Orders
          </li>
        </ul>
      </div>

      {/* 🔹 Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 min-[664px]:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}