import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const isLocalStorageItemsExists = () => {
    const authToken = localStorage.getItem('authToken');
    const userProfile = localStorage.getItem('userProfile');

    // Return true if both authToken and userProfile are present, false otherwise
    return authToken !== null && userProfile !== null;
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(isLocalStorageItemsExists());
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userProfile')));
    const navigate = useNavigate();

    const handleLoginSuccess = (authToken, userProfile) => {
        // Store token and user data in localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        // Update application state
        setUser(userProfile);
        setIsLoggedIn(true);
        setLoading(false);

        // Redirect to the dashboard
        navigate('/dashboard');
    };

    const handleLogin = () => {
        setLoading(true);
        // Start authentication process
        window.location.href = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/auth/login/federated/google`;
    };

    const handleLogoutSuccess = () => {
        // Remove token and user data in localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userProfile');

        // Update application state
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);

        // Redirect to home or login page
        navigate('/');
    }

    const handleLogout = async () => {
        // set application loading status
        setLoading(true);
        
        try {
            // Logout if the authToken or userProfile information is tempered
            if (!isLocalStorageItemsExists()) {
                return handleLogoutSuccess();
            }

            // Retrieve the token from local storage
            const authToken = localStorage.getItem('authToken');

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/auth/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                console.log('Logout successfully');
            } else if (response.status === 401) {
                console.log('Unauthorized token, proceeding to logout')
            } else {
                console.error('Logout failed, status:', response.status);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

        handleLogoutSuccess();

    }

    useEffect(() => {
        // Logout if the user is logged in and authToken or userProfile information is tempered
        if (isLoggedIn && !isLocalStorageItemsExists()) {
            handleLogoutSuccess();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loading, setUser, setLoading, handleLogin, handleLoginSuccess, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
