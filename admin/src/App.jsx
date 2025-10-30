// Main Admin Panel Application
// This file sets up the admin dashboard with routing and authentication

// Import necessary routing components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// Import admin panel sections
import Sidebar from "./Components/SideBar";        // Navigation sidebar
import Dashboard from "./Components/Dashbord";      // Main dashboard view
import Products from "./Components/Products";       // Product management
import Orders from "./Components/Orders";          // Order tracking
import Vendors from "./Components/Vendors";        // Vendor management
import Users from "./Components/Users";            // User management

// Authentication components
import { GoogleOAuthProvider } from "@react-oauth/google";
import SigninForm from "./Components/Signin";
import SignupForm from "./Components/SignUp";

// Data management and routing protection
import { useQuery } from "@tanstack/react-query";
import { authCheck } from "../API/product";
import { CartProductContext } from "./services/context";
import { useEffect, useState } from "react";
import ProtectedRoute from "./services/protectedRoute";

// Google OAuth configuration for admin authentication
const GOOGLE_CLIENT_ID = "316084868865-6cm9ag49f38mgqp25ttja2i61cbjbl6l.apps.googleusercontent.com";

const GoogleAuthWrapper = ({ children }) => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    {children}
  </GoogleOAuthProvider>
);

export const App = () => {
  const [checkAuth, setCheckAuth] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["authcheck"],
    queryFn: authCheck,
    select: (res) => res?.data || null,
    retry: 1, // Only retry once to avoid long delays
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });

  const location = useLocation();
  const isSignupPage = ["/signup", "/signin"].includes(location.pathname);

  // Update authentication state when the API check completes
  useEffect(() => {
    if (!isLoading) {
      // Set auth state based on API response
      setCheckAuth(!!data?.isAuthenticate);
      setInitialLoadComplete(true);
    }
  }, [data, isLoading]);

  // Show loading spinner during initial authentication check
  // Displays only during the first load to prevent flashing on subsequent checks
  if (isLoading && !initialLoadComplete) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Security: Redirect to signin if authentication fails
  // Only redirects if not already on signup/signin pages
  if (error && !isSignupPage && initialLoadComplete) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <CartProductContext.Provider 
      value={{
        user: data?.user, 
        isLoading, 
        checkAuth, 
        setCheckAuth,
        initialLoadComplete
      }}
    >
      <div className="flex min-h-screen">
        {!isSignupPage && checkAuth && (
          <div>
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route
              path="/signup"
              element={
                <GoogleAuthWrapper>
                  <SignupForm setCheckAuth={setCheckAuth} />
                </GoogleAuthWrapper>
              }
            />
            <Route
              path="/signin"
              element={
                <GoogleAuthWrapper>
                  <SigninForm setCheckAuth={setCheckAuth} />
                </GoogleAuthWrapper>
              }
            />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute>
                  <Vendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </CartProductContext.Provider>
  );
};

export default App;