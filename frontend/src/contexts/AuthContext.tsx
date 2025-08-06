import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice';
import { isAuthenticated, getCurrentUser } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [user, setUserState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const hasLocalAuth = isAuthenticated();
      const localUser = getCurrentUser();

      if (hasLocalAuth && localUser) {
        dispatch(setUser(localUser));
        setUserState(localUser);
        setIsAuthenticatedState(true);
      } else {
        setUserState(null);
        setIsAuthenticatedState(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch(setUser({}));
    setUserState(null);
    setIsAuthenticatedState(false);
  };

  const value = {
    isAuthenticated: isAuthenticatedState,
    user,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 