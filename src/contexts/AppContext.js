import React, { createContext, useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../theme/theme';

// Create a context with an initial state
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const homeMenuConfig = [];
    const [currentMenuConfig, setCurrentMenuConfig] = useState([]);
    const [appTheme, setAppTheme] = useState(() => {
        return localStorage.getItem('appTheme') || 'light';
    });

    useEffect(() => {
        // Set the theme in localStorage whenever appTheme changes
        localStorage.setItem('appTheme', appTheme);
    }, [appTheme]);

    const toggleTheme = () => {
        const newTheme = appTheme === 'light' ? 'dark' : 'light';
        setAppTheme(newTheme);
    };

    return (
        <AppContext.Provider value={{ loading, setLoading, homeMenuConfig, currentMenuConfig, setCurrentMenuConfig, toggleTheme }}>
            <ThemeProvider theme={appTheme === 'light' ? lightTheme : darkTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppContext.Provider>
    );
};