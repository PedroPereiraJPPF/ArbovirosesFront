import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  fullName: string;
  cpf: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: () => void;
  refreshTokens: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const navigate = useNavigate();

  const baseApiUrl = process.env.REACT_APP_API_URL || "";

  const checkAuthStatus = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('token');
      const userName = localStorage.getItem('userName');

      if (accessToken && refreshToken && userName) {
        setUser({ 
          fullName: userName, 
          cpf: localStorage.getItem('userCpf') || '' 
        });
        setIsAuthenticated(true);
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    try {
      console.log('AuthContext: Logging in user', userData);
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('token', refreshToken);
      localStorage.setItem('userName', userData.fullName);
      localStorage.setItem('userCpf', userData.cpf);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('AuthContext: Login successful, user is now authenticated');
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to save authentication data');
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCpf');
    localStorage.removeItem('yearSelected');
    localStorage.removeItem('agravoSelected');
    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = () => {
    try {
      clearAuth();
      // Navigate to login page using React Router
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback: force page reload
      window.location.href = '/auth/login';
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${baseApiUrl}/auth/refreshToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: refreshToken
        })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.jwtToken) {
        localStorage.setItem('accessToken', data.jwtToken);
        
        // If a new refresh token is provided, update it
        if (data.refreshToken) {
          localStorage.setItem('token', data.refreshToken);
        }
        
        return true;
      } else {
        throw new Error('Invalid response from token refresh');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // If refresh fails, log the user out
      setTimeout(() => {
        logout();
      }, 100);
      
      return false;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshTokens
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
