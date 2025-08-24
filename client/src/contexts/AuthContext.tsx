import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('spmos_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('spmos_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        email,
        password,
      });
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('spmos_user', JSON.stringify(data.user));
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const signup = async (userData: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    phoneNumber?: string;
  }) => {
    try {
      const response = await apiRequest('POST', '/api/auth/signup', userData);
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('spmos_user', JSON.stringify(data.user));
    } catch (error) {
      throw new Error('Failed to create account');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spmos_user');
    localStorage.removeItem('spmos_session');
    localStorage.removeItem('spmos_booking');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
