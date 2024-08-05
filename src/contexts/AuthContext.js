import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/check-auth`, {
                    withCredentials: true
                });
                setIsLoggedIn(response.data.loggedIn);
            } catch (error) {
                console.error('Failed to check auth:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
