import { useState, useContext, createContext, useEffect } from 'react';
import logout from '../api/logout';

// Create an Auth Context
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);  // Hook to use the Auth context
};

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {

    const login = (data) => {
        try {
            localStorage.setItem('session', data.sessionId);
            localStorage.setItem('user', data.username);
            
        } catch (error) {
            console.error("Error decoding token", error);
        }
    };

    const logoutHandler = () => {

        try {
            logout();
            localStorage.removeItem('session');
            localStorage.removeItem('user');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        } catch (error) {
            console.error("Error logging out", error);
        }
        
    };

    return (
        <AuthContext.Provider value={{login, logoutHandler}}>
            {children}
        </AuthContext.Provider>
    );
};
