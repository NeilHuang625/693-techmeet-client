import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthProvider";
import Loading from "./Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  return isLoading ? (
    <Loading />
  ) : isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};
export default ProtectedRoute;
