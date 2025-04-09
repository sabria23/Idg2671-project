import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if a token exists in localStorage = means if ti si authenticated
    const token = localStorage.getItem('token');
    
    // If not authenticated, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    // If authenticated, render the children
    return children;
};

export default ProtectedRoute;