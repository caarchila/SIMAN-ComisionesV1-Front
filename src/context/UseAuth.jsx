import {jwtDecode} from 'jwt-decode';
import { useState, useContext, createContext, useEffect } from 'react';

// Create an Auth Context
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);  // Hook to use the Auth context
};

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status
    const [user, setUser] = useState(null); // User state

    // Effect to check for authentication when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const expirationDate = decodedToken.exp * 1000; // Convert to milliseconds
                if (Date.now() < expirationDate) {
                    // If the token is still valid, set the user and isAuthenticated state
                    setUser(decodedToken);
                    setIsAuthenticated(true);
                } else {
                    logout(); // Token has expired, clear state and localStorage
                }
            } catch (error) {
                console.error("Invalid token", error);
                logout(); // Clear state if token is invalid
            }
        }
    }, []); // Empty dependency array to run this only once on mount

    const login = (data) => {
        try {
            const decodedToken = jwtDecode(data.accessToken);
            console.log(decodedToken);
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', decodedToken.sub);
            localStorage.setItem('role', decodedToken.roles[0]);
            localStorage.setItem('exp', decodedToken.exp);
            setUser(decodedToken);
            setIsAuthenticated(true); // Set auth status to true
            window.location.href = '/dashboard'; // Redirect to the dashboard
        } catch (error) {
            console.error("Error decoding token", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('exp');
        setUser(null); // Clear user state on logout
        setIsAuthenticated(false); // Clear auth status on logout
        window.location.href = '/'; // Redirect to login or home
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};
