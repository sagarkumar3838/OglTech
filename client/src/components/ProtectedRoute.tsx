import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Add admin check logic here if needed
  if (adminOnly) {
    // Check if user has admin role
    // This would require custom claims or database check
  }

  return <>{children}</>;
};

export default ProtectedRoute;
