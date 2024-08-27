import { getUserInfo } from "../Utils/API";
import {
  useState,
  useEffect,
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

  useEffect(() => {
    const fetchUser = async () => {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        const response = await getUserInfo(jwt);
        console.log(response);
        if (response.status === 200) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
