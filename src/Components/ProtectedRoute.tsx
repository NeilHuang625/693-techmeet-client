import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};
export default ProtectedRoute;
