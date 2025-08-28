import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("spmos_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email: string, password: string) => {
    // Simple dummy login logic
    if (email === "test@example.com" && password === "password123") {
      const dummyUser = { email: "test@example.com", fullName: "Test User" };
      localStorage.setItem("spmos_user", JSON.stringify(dummyUser));
      setUser(dummyUser);
      setIsAuthenticated(true);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid email or password"));
  };

  const signup = (userData: any) => {
    // Simple dummy signup logic
    const dummyUser = { email: userData.email, fullName: userData.fullName };
    localStorage.setItem("spmos_user", JSON.stringify(dummyUser));
    setUser(dummyUser);
    setIsAuthenticated(true);
    return Promise.resolve();
  };

  const logout = () => {
    localStorage.removeItem("spmos_user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
