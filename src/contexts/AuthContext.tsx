import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First, check if there's token and user data in URL params (from redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const urlUserData = urlParams.get('user');
        
        if (urlToken && urlUserData) {
          try {
            const decodedUser = JSON.parse(decodeURIComponent(urlUserData));
            const decodedToken = decodeURIComponent(urlToken);
            
            // Save to localStorage
            localStorage.setItem('token', decodedToken);
            localStorage.setItem('user', JSON.stringify(decodedUser));
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            setUser(decodedUser);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          } catch (e) {
            console.error('Error parsing URL params:', e);
          }
        }

        // Check existing token in localStorage
        const isValid = await authService.validateToken();
        if (isValid) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // Try automatic login with coach credentials for development
          try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
            const loginResponse = await fetch(`${apiBaseUrl}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: 'coach@treinogo.com',
                password: '123456'
              })
            });

            if (loginResponse.ok) {
              const { token, user: authUser } = await loginResponse.json();
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(authUser));
              setUser(authUser);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Auto-login failed:', error);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    authService.logout();
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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