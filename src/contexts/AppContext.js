import React, { createContext, useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../theme/theme';
import { isLocalStorageItemsExists } from '../components/utils/localStorage';
import { useNavigate } from 'react-router-dom';

// Create a context with an initial state
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [loggedIn, setLoggedIn] = useState(isLocalStorageItemsExists());
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userProfile')));
    const homeMenuConfig = [];
    const [currentMenuConfig, setCurrentMenuConfig] = useState([]);
    const [appTheme, setAppTheme] = useState(() => {
        return localStorage.getItem('appTheme') || 'light';
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Set the theme in localStorage whenever appTheme changes
        localStorage.setItem('appTheme', appTheme);
    }, [appTheme]);

    const toggleTheme = () => {
        const newTheme = appTheme === 'light' ? 'dark' : 'light';
        setAppTheme(newTheme);
    };

    const clearAuthDataAndRedirect = () => {
        // Update application state
        // debugger
        setUser(null);
        setLoggedIn(false);
        setCurrentMenuConfig(homeMenuConfig);

        // Clear localStorage
        localStorage.clear();

        // Redirect to the root
        navigate('/');
    };

    return (
        <AppContext.Provider value={{ loading, setLoading, homeMenuConfig, currentMenuConfig, setCurrentMenuConfig, toggleTheme, loggedIn, setLoggedIn, user, setUser, clearAuthDataAndRedirect }}>
            <ThemeProvider theme={appTheme === 'light' ? lightTheme : darkTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppContext.Provider>
    );
};