import { logout, refreshToken } from "../Utils/API";
import { JwtPayload, jwtDecode } from "jwt-decode";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

export interface User {
  id: string;
  email: string;
  nickname: string;
  roles: string;
  profileImageUrl: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
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

interface ExtendedJwtPayload extends JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": string;
  ProfilePhotoUrl: string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isLoading: true,
  user: null,
  setUser: () => {},
  jwt: null,
  setJwt: () => {},
  isExtendDialogOpen: false,
  handleLogout: async () => {},
  handleJwtRefresh: async () => {},
  timeAhead: 0,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [jwt, setJwt] = useState<string | null>(localStorage.getItem("jwt"));
  const [isLoading, setIsLoading] = useState(true);
  const checkIsJwtExpired = (jwt: string) => {
    const decodedJwt = jwtDecode(jwt);
    const expireTimeInMs = decodedJwt.exp ? decodedJwt.exp * 1000 : 0;
    const currentTimeInMs = new Date().getTime();
    return currentTimeInMs >= expireTimeInMs;
  };

  // Amount of Time to Select Stay Logged In or Logout before the JWT expires
  const timeAhead = 1000 * 60;
  const fiveMinutes = 1000 * 60 * 5; // 5 Minutes ahead of the JWT expiration time

  useEffect(() => {
    setIsLoading(true);
    if (jwt) {
      const isExpired = checkIsJwtExpired(jwt);
      if (isExpired) {
        setIsAuthenticated(false);
        localStorage.removeItem("jwt");
        setUser(null);
        setIsLoading(false);
      } else {
        if (localStorage.getItem("jwt")) {
          localStorage.removeItem("jwt");
        }
        localStorage.setItem("jwt", jwt);
        setIsAuthenticated(true);

        const decodedJwt = jwtDecode<ExtendedJwtPayload>(jwt);
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
          profileImageUrl: decodedJwt["ProfilePhotoUrl"],
        };
        setUser(userData);
        setIsLoading(false);

        const expireTimeInMs = decodedJwt.exp ? decodedJwt.exp * 1000 : 0;
        const currentTimeInMs = new Date().getTime();
        const timeLeft = expireTimeInMs - currentTimeInMs;
        const timer = setTimeout(() => {
          setIsExtendDialogOpen(true);
        }, timeLeft - timeAhead - fiveMinutes); // Make sure the API receives the valid JWT before it expires
        return () => clearTimeout(timer);
      }
    } else {
      setIsLoading(false);
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
  console.log("isAuthenticated", isAuthenticated);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
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
