import { useContext, useEffect, useState } from "react";
import { CartProductContext } from "../../services/context";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../API/api";
import Sidebar from "./sidebar";
import Dashboard from "./components/dashboard";
import VendorProducts from "./components/vendorProducts";
import VendorOrders from "./components/vendorOrders";
import { Menu, X } from "lucide-react";

export const VendorDashboard = () => {
  const [selectedField, setSelectedField] = useState("dashboard")
  const { checkAuth, loadinguser } = useContext(CartProductContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(loadinguser) return
    if (!checkAuth){
      navigate("/signin")
    }
  },[checkAuth, navigate, loadinguser])


  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res?.data?.success) {
        navigate("/signin");
      } else {
        console.error("Logout failed");
        navigate("/signin");
      }
    } catch (error) {
      console.log("Logout error:", error);
      navigate("/signin");
    }
  };

  return (
    <section>
        <div>
            <Sidebar setSelectedField={setSelectedField} isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`fixed top-2 z-50 p-1 bg-black text-white rounded-lg shadow-lg hover:bg-gray-100 hover:text-black left-3`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {
          selectedField === "dashboard" ? <Dashboard handleLogout={handleLogout}/> 
          : selectedField === "products" ? <VendorProducts/>
          : selectedField === "orders" ? <VendorOrders/> : ""
        }
    </section>
  );
}

export default Dashboard