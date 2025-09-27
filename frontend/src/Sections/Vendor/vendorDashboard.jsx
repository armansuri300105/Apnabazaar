import { useContext, useEffect, useState } from "react";
import { CartProductContext } from "../../services/context";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../API/api";
import Sidebar from "./sidebar";
import Dashboard from "./components/dashboard";
import VendorProducts from "./components/vendorProducts";
import VendorOrders from "./components/vendorOrders";

export const VendorDashboard = () => {
  const [selectedField, setSelectedField] = useState("dashboard")
  const { checkAuth, loadinguser } = useContext(CartProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(loadinguser)
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
    <section className="flex">
        <div className="">
            <Sidebar setSelectedField={setSelectedField}/>
        </div>
        {
          selectedField === "dashboard" ? <Dashboard handleLogout={handleLogout}/> 
          : selectedField === "products" ? <VendorProducts/>
          : selectedField === "orders" ? <VendorOrders/> : ""
        }
    </section>
  );
}

export default Dashboard