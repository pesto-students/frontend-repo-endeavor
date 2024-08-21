import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from './AppContext';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const { setLoading } = useContext(AppContext);

    const makeRequest = async (options = {}) => {
        const {
            data,
            url,
            method = 'GET',
            customHandleRequestSuccess = (response) => console.log('Request successful:', response.data),
            contentType = 'application/json',
            setAppLoadingStatus = true
        } = options;

        if (setAppLoadingStatus) {
            setLoading(true);
        }

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios({
                url,
                method,
                data: method !== 'GET' ? data : undefined,
                headers: {
                    'Content-Type': contentType,
                    'Authorization': `Bearer ${authToken}`,
                },
                withCredentials: true,
            });

            if (response.status >= 200 && response.status < 300) {
                console.log(`${method} request successful, url: ${url}`);
                customHandleRequestSuccess(response);
            } else {
                console.error(`${method} request failed, url: ${url}, response status: ${response.status}, response data: ${response.data}`);
            }
        } catch (error) {
            console.error(`${method} request failed, url: ${url}, an error occurred:`, error.response?.data || error.message);
        }

        if (setAppLoadingStatus) {
            setLoading(false);
        }
    };

    return (
        <ApiContext.Provider value={{ makeRequest }}>
            {children}
        </ApiContext.Provider>
    );
};
