import { createContext, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './AppContext';
import { ApiContext } from './ApiContext';
import { isLocalStorageItemsExists } from '../utils/localStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const { setLoading, loggedIn, setLoggedIn, user, setUser, clearAuthDataAndRedirect } = useContext(AppContext);
    const { makeRequest } = useContext(ApiContext);

    const handleLoginSuccess = (userProfile) => {
        // Store user data in localStorage
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
        // Redirect to home or login page
        clearAuthDataAndRedirect();
    }

    const handleLogout = async () => {
        const logoutUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/auth/logout`;
        const logoutMethod = 'POST';
        makeRequest({ 
            url: logoutUrl, 
            method: logoutMethod,
            customHandleRequestSuccess: handleLogoutSuccess 
        });
    }

    useEffect(() => {
        // Logout if the user is logged in and localStorage information is tempered
        if (loggedIn && !isLocalStorageItemsExists()) {
            handleLogoutSuccess();
        }
    }, []);

    const reloadUser = () => {
        const fetchUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/user/search/${user._id}`;
        makeRequest({
            url: fetchUrl,
            method: 'POST',
            customHandleRequestSuccess: (response) => {
                let userProfile = response.data && response.data.userProfile;
                if (userProfile) {
                    updateUser(userProfile);
                }
            }
        });
    }

    const updateUser = (userProfile) => {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        setUser(userProfile);
    }

    return (
        <AuthContext.Provider value={{ handleLogin, handleLoginSuccess, handleLogout, reloadUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
