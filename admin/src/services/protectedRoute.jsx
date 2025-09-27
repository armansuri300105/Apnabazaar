import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CartProductContext } from "./context";

export default function ProtectedRoute({ children }) {
  const { checkAuth, isLoading, initialLoadComplete } = useContext(CartProductContext);

  // Show loading during initial auth check or ongoing auth operations
  if (isLoading || !initialLoadComplete) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Only redirect if we're sure the user is not authenticated
  // and we've completed the initial load
  if (!checkAuth && initialLoadComplete) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}