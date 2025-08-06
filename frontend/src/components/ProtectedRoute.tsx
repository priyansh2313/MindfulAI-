import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth';

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo = '/login' }) => {
  const user = useSelector((state: any) => state.user?.user);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Give a small delay to allow Redux state to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }
  
  // Check both Redux state and localStorage for authentication
  const isUserAuthenticated = user && Object.keys(user).length > 0;
  const isLocalStorageAuthenticated = isAuthenticated();
  
  // If user is not authenticated in either place, redirect to login
  if (!isUserAuthenticated && !isLocalStorageAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If user exists in localStorage but not in Redux, we should sync them
  if (!isUserAuthenticated && isLocalStorageAuthenticated) {
    // This will be handled by the App component's useEffect
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute; 