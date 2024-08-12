import axios from 'axios';
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useHttpRequest from '../hooks/useHttpRequest'
import { AppContext } from './AppContext';

const isLocalStorageItemsExists = () => {
    const authToken = localStorage.getItem('authToken');
    const userProfile = localStorage.getItem('userProfile');

    // Return true if both authToken and userProfile are present, false otherwise
    return authToken !== null && userProfile !== null;
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const { setLoading } = useContext(AppContext);
    const [loggedIn, setLoggedIn] = useState(isLocalStorageItemsExists());
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userProfile')));
    const initialLogoutData = {};
    const initialLogoutUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/auth/logout`;
    const initialLogoutMethod = 'POST';
    const { makeRequest } = useHttpRequest(initialLogoutData, initialLogoutUrl, initialLogoutMethod);


    const handleLoginSuccess = (authToken, userProfile) => {
        // Store token and user data in localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        // Update application state
        setUser(userProfile);
        setLoggedIn(true);
        setLoading(false);

        // Redirect to the dashboard
        navigate('/dashboard');
    };

    const handleLogin = () => {
        setLoading(true);
        // Start authentication process
        window.location.href = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/auth/login/federated/google`;
    };

    const handleLogoutSuccess = (response) => {
        // Remove token and user data in localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userProfile');

        // Update application state
        setUser(null);
        setLoggedIn(false);

        // Redirect to home or login page
        navigate('/');
    }

    const handleLogout = async () => {
        makeRequest({ customHandleRequestSuccess: handleLogoutSuccess });
    }

    useEffect(() => {
        // Logout if the user is logged in and authToken or userProfile information is tempered
        if (loggedIn && !isLocalStorageItemsExists()) {
            handleLogoutSuccess();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, user, setUser, handleLogin, handleLoginSuccess, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
