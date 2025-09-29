import { Menu, X } from "lucide-react";

export default function Sidebar({setSelectedField, isOpen, setIsOpen}) {
  return (
    <>
      {/* 🔹 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-6 space-y-4 z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-xl font-bold hidden mt-[20px]">
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