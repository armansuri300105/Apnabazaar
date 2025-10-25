import { Mission } from "./Sections/About/Parts/Mission";
import { Stats } from "./Sections/About/Parts/stats";
import { Story } from "./Sections/About/Parts/Story";
import { MeetTeam } from "./Sections/About/Parts/MeetTeam";
import { CategoryBody } from "./Sections/Category/Parts/Body";
import { HomeBody } from "./Sections/Home/HomeBody";
import { NavBar } from "./Sections/Navbar/navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProductContext } from "./services/context";
import { FooterSection } from "./Sections/footer-section/Footer";
import ContactUs from "./Sections/Contact/Parts/contact";
import { useState } from "react";
import SignupForm from "./Sections/User/SignUp";
import SigninForm from "./Sections/User/Signin";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useQuery } from "@tanstack/react-query";
import { authCheck } from "../API/api";
import Profile from "./Sections/User/Profile/profile";
import Checkout from "./Sections/Order/checkout";
import ProductDetails from "./Sections/Product/ProductDetails";
import ScrollToTop from "./scrolltotop";
import Orders from "./Sections/Order/orders";
import VendorForm from "./Sections/Vendor/vendorForm";
import { VendorDashboard } from "./Sections/Vendor/vendorDashboard";
import TrackOrder from "./Sections/Order/trackOrder";
import { useEffect } from "react";
import { userInteresctionDataServer } from "../API/api";
import Search from "./Sections/Product/search";
import SendVerification from "./Sections/User/sendVerification";
import VerifyAccount from "./Sections/User/verifyAccount";
import ForgotPassword from "./Sections/User/forgotPassword";
import OrderPage from "./Sections/Order/orderPage";

const GOOGLE_CLIENT_ID = "316084868865-6cm9ag49f38mgqp25ttja2i61cbjbl6l.apps.googleusercontent.com";

const GoogleAuthWrapper = ({ children }) => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    {children}
  </GoogleOAuthProvider>
);

const App = () => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("Cart");
    return saved ? JSON.parse(saved) : [];
  });


  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["authcheck"],
    queryFn: authCheck,
    select: (res) => res?.data || null,
  });
  const [dataForMl, setDataForMl] = useState(() => {
    const saved = localStorage.getItem("interaction");
    return saved ? JSON.parse(saved) : {};
  });
  
  useEffect(() => {
    setDataForMl(prev => ({
      ...prev,
      user: data?.user?._id,
    }))
  },[data])

  const checkAuth = !!data?.isAuthenticate;

  const [items, setItems] = useState(0);
  const [cmenu, setCmenu] = useState(false);
  const location = useLocation();
  const isSignupPage = ["/signup", "/signin", "/checkout" ,"/vendor/dashboard", "/user/verify", "/user/forgotpassword"].includes(location.pathname) || location.pathname.startsWith("/user/verify/") || location.pathname.startsWith("/checkout/order/");;

  useEffect(() => {
    const sendInteractionData = async () => {
      if (!dataForMl?.products?.length) return;

      try {
        const res = await userInteresctionDataServer(dataForMl);

        setDataForMl({user: data?.user?._id, products: [], currentView: null });
        localStorage.removeItem("interaction");
      } catch (err) {
        console.error("Error sending interaction data:", err);
      }
    };

    if (dataForMl?.products?.length >= 10) {
      sendInteractionData();
    }

    const interval = setInterval(sendInteractionData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dataForMl]);



  useEffect(() => {
    const handleBeforeUnload = () => {
      if (dataForMl?.products?.length > 0) {
        navigator.sendBeacon("http://localhost:3000/api/user/interaction", JSON.stringify(dataForMl));
        setDataForMl({user: data?.user?._id, products: [], currentView: null });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dataForMl]);


  return (
    <CartProductContext.Provider
      value={{
        cartItems,
        setCartItems,
        items,
        setItems,
        checkAuth,
        user: data?.user,
        cmenu,
        setCmenu,
        loadinguser: isLoading,
        dataForMl,
        setDataForMl,
        refetch
      }}
    >
      {!isSignupPage && <NavBar />}
      <ScrollToTop />

      {isLoading && <p className="text-center py-5">Loading...</p>}
      {error && <p className="text-center text-red-500 py-5">Failed to fetch user</p>}

      <Routes>
        <Route path="/" element={<HomeBody />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/categories/:catname" element={<CategoryPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="/signup"
          element={
            <GoogleAuthWrapper>
              <SignupForm />
            </GoogleAuthWrapper>
          }
        />
        <Route
          path="/signin"
          element={
            <GoogleAuthWrapper>
              <SigninForm />
            </GoogleAuthWrapper>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders user={data?.user} />} />
        <Route path="productdetail/:Productid" element={<ProductDetails />} />
        <Route path="/vendor/form" element={<VendorForm/>} />
        <Route path="/vendor/dashboard" element={<VendorDashboard/>} />
        <Route path="/orders/:orderId" element={<TrackOrder/>} />
        <Route path="/search/:text" element={<Search/>} />
        <Route path="/user/send" element={<SendVerification/>} />
        <Route path="/user/verify/:verificationcode" element={<VerifyAccount/>} />
        <Route path="/user/forgotpassword" element={<ForgotPassword/>} />
        <Route path="/checkout/order/:orderId" element={<OrderPage/>} />
      </Routes>

      {!isSignupPage && <FooterSection loadinguser={isLoading} />}
    </CartProductContext.Provider>
  );
};

function CategoryPage() {
  return (
    <div className="flex justify-center">
      <CategoryBody/>
    </div>
  );
}

function About() {
  return (
    <div>
      <Story />
      <Stats />
      <Mission />
      <MeetTeam />
    </div>
  );
}

export default App;