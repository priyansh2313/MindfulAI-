import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/slices/userSlice';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import axios from './axios/axios';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if we have local authentication data
        const hasLocalAuth = isAuthenticated();
        const localUser = getCurrentUser();

        if (hasLocalAuth && localUser) {
          // Set user in Redux state
          dispatch(setUser(localUser));
          setIsAuthenticatedState(true);
        } else {
          // Try to validate with server
          try {
            const response = await axios.get('/users/check');
            if (response.data.user) {
              dispatch(setUser(response.data.user));
              localStorage.setItem('user', JSON.stringify(response.data.user));
              setIsAuthenticatedState(true);
            } else {
              // Clear any stale data
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setIsAuthenticatedState(false);
            }
          } catch (error) {
            // Server validation failed, clear local data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setIsAuthenticatedState(false);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticatedState(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch(setUser({}));
    setIsAuthenticatedState(false);
    navigate('/login');
  };

  return {
    isAuthenticated: isAuthenticatedState,
    isLoading,
    logout
  };
}; 