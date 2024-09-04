import { logout, refreshToken } from "../Utils/API";
import { jwtDecode } from "jwt-decode";
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
  roles: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  jwt: string | null;
  setJwt: Dispatch<SetStateAction<string | null>>;
  isExtendDialogOpen: boolean;
  handleLogout: (jwt: string) => Promise<void>;
  handleJwtRefresh: (jwt: string) => Promise<void>;
  timeAhead: number;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
  jwt: null,
  setJwt: () => {},
  isExtendDialogOpen: false,
  handleLogout: async (jwt: string) => {},
  handleJwtRefresh: async (jwt: string) => {},
  timeAhead: 0,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [jwt, setJwt] = useState<string | null>(localStorage.getItem("jwt"));

  const checkIsJwtExpired = (jwt: string) => {
    const decodedJwt = jwtDecode(jwt);
    const expireTimeInMs = decodedJwt.exp * 1000;
    const currentTimeInMs = new Date().getTime();
    return currentTimeInMs >= expireTimeInMs;
  };

  const timeAhead = 1000 * 50;

  useEffect(() => {
    if (jwt) {
      const isExpired = checkIsJwtExpired(jwt);
      if (isExpired) {
        setIsAuthenticated(false);
        localStorage.removeItem("jwt");
        setUser(null);
      } else {
        setIsAuthenticated(true);

        const decodedJwt = jwtDecode(jwt);
        // Extract the user data from the decoded JWT
        const userData = {
          email:
            decodedJwt[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ],
          id: decodedJwt[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
          roles:
            decodedJwt[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
          nickname:
            decodedJwt[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"
            ],
        };

        setUser(userData);
        const fiveMinutes = 1000 * 60 * 5; // 5 Minutes in Milliseconds

        const expireTimeInMs = decodedJwt.exp * 1000;
        const currentTimeInMs = new Date().getTime();
        const timeLeft = expireTimeInMs - currentTimeInMs;
        const timer = setTimeout(() => {
          setIsExtendDialogOpen(true);
        }, timeLeft - timeAhead - fiveMinutes); // Make sure the API receives the valid JWT before it expires
        return () => clearTimeout(timer);
      }
    }
  }, [jwt]);

  const handleLogout = async (jwt: string) => {
    try {
      const response = await logout(jwt);
      if (response.status === 200) {
        localStorage.removeItem("jwt");
        setIsAuthenticated(false);
        setUser(null);
        setIsExtendDialogOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleJwtRefresh = async (jwt: string) => {
    if (jwt) {
      try {
        const response = await refreshToken(jwt);
        console.log("response", response);
        if (response.status === 200) {
          const newJwt = response.data.token.result;
          setJwt(newJwt);
          localStorage.setItem("jwt", newJwt);
          setIsExtendDialogOpen(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  console.log("user", user);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        jwt,
        setJwt,
        isExtendDialogOpen,
        handleLogout,
        handleJwtRefresh,
        timeAhead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
