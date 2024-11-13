import { useState, useContext, createContext, useEffect } from 'react';
import logout from '../api/logout';

// Create an Auth Context
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);  // Hook to use the Auth context
};

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {

    const login = (response) => {
        try {
            
            sessionStorage.setItem('session', response.data.sessionId);
            localStorage.setItem('user', response.data.username);
            window.location.href = '/rrhh-comisiones/dashboard';
            
        } catch (error) {
            console.error("Error decoding token", error);
        }
    };

    const logoutHandler = () => {

        try {
            logout();
            clearSession();
            setTimeout(() => {
                window.location.href = '/rrhh-comisiones/';
            }, 2000);

        } catch (error) {
            console.error("Error logging out", error);
        }
        
    };

    const clearSession = () => {
        sessionStorage.removeItem('session');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{login, logoutHandler, clearSession}}>
            {children}
        </AuthContext.Provider>
    );
};
