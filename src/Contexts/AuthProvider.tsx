import { useState, createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  checkAuth: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  checkAuth: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const jwt = localStorage.getItem("jwt");
    setIsAuthenticated(!!jwt);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
