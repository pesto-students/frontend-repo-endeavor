import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AppContext } from './AppContext';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const { setLoading, clearAuthDataAndRedirect } = useContext(AppContext);

    const refreshTokenRequest = (customHandleRequestSuccess) => {
        const refreshTokenUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/auth/refresh-token`;
        const refreshTokenMethod = 'POST';
        makeRequest({ 
            url: refreshTokenUrl, 
            method: refreshTokenMethod,
            refreshToken: false,
            "customHandleRequestSuccess": (response) => {
                if (process.env.REACT_APP_AUTH_TOKEN_STORAGE === "localstorage") {
                    if (response.data && response.data.accessToken) localStorage.setItem('accessToken', response.data.accessToken);
                    if (response.data && response.data.refreshToken) localStorage.setItem('refreshToken', response.data.refreshToken);
                }
                customHandleRequestSuccess(response);
            }
        });
    }

    const makeRequest = async (options = {}) => {
        const {
            data,
            url,
            method = 'GET',
            customHandleRequestSuccess = (response) => console.log('Request successful:', response.data),
            contentType = 'application/json',
            setAppLoadingStatus = true,
            refreshToken = true
        } = options;

        if (setAppLoadingStatus) {
            setLoading(true);
        }

        const headers = {
            'Content-Type': contentType
        }

        if (process.env.REACT_APP_AUTH_TOKEN_STORAGE === "localstorage") {
            const accessToken = localStorage.getItem('accessToken'); // Get the access token from localStorage (or from another secure place)
            const refreshToken = localStorage.getItem('refreshToken'); // Get the refresh token

            if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
            if (refreshToken) headers['refresh-token'] = refreshToken;
        }

        try {
            const response = await axios({
                url,
                method,
                data: method !== 'GET' ? data : undefined,
                headers: headers,
                withCredentials: process.env.REACT_APP_AUTH_TOKEN_STORAGE !== "localstorage",
                validateStatus: (status) => {
                    if (
                        status === 200 || status === 201 ||
                        status === 400 || status === 401 || status === 403
                    ) {
                        return true;
                    }
                    return false;
                }
            });

            if (response.status === 200 || response.status === 201) {
                console.log(`${method} request successful, url: ${url}`);
                customHandleRequestSuccess(response);
            } else if (response.status === 400) {
                console.log("Invalid request, logging out");
                clearAuthDataAndRedirect();
            } else if (response.status === 401 || response.status === 403) {
                if (refreshToken) {
                    console.log("Unauthorized or missing accessToken, refreshing token");
                    refreshTokenRequest(
                        () => {
                            makeRequest({
                                data,
                                url,
                                method,
                                customHandleRequestSuccess,
                                contentType,
                                setAppLoadingStatus,
                                refreshToken: false
                            })
                        }
                    );
                } else {
                    console.log("Access token expired, logging out")
                    clearAuthDataAndRedirect();
                }
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
