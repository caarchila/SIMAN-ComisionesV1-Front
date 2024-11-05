import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

    const session = localStorage.getItem('session');
    
    return session ? children : <Navigate to="/rrhh-comisiones" />;  // Redirect to login if not authenticated
};

export default ProtectedRoute;
