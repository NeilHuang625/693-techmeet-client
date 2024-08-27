import {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

interface User {
  id: string;
  email: string;
  nickname: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  checkAuth: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setUser: () => {},
  checkAuth: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = () => {
    const jwt = localStorage.getItem("jwt");
    setIsAuthenticated(!!jwt);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
