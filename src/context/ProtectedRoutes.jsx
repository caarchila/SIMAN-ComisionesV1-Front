import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './UseAuth';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();  // Get the current authentication status

    

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); 
    const currentTimeInMilliseconds = new Date().getTime();
    const expirationTime = localStorage.getItem('exp') * 1000;

    //Boolean conditionsMet = (token && role === "ROLE_administrador")
    
    //localStorage.getItem('token');
    
    return ((token && role === "ROLE_Administrador") && (currentTimeInMilliseconds < expirationTime)) ? children : <Navigate to="/" />;  // Redirect to login if not authenticated
};

export default ProtectedRoute;
