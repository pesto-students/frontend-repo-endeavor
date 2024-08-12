import React, { createContext, useState } from 'react';

// Create a context with an initial state
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <AppContext.Provider value={{ loading, setLoading }}>
            {children}
        </AppContext.Provider>
    );
};