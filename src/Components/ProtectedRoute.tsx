import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthProvider";
import { dotWave } from "ldrs";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  dotWave.register();
  return isLoading ? (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <l-dot-wave size="47" speed="1" color="black"></l-dot-wave>
    </div>
  ) : isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};
export default ProtectedRoute;
