import { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../contexts/AppContext';

const useHttpRequest = (initialData = {}, initialUrl, initialMethod = 'GET') => {
    const { setLoading } = useContext(AppContext);
    const [responseData, setResponseData] = useState(null);
    const [requestData, setRequestData] = useState(initialData);


    const defaultHandleRequestSuccess = (response) => {
        setResponseData(response.data);
    };

    const makeRequest = async (options = {}) => {
        const {
            data = requestData,
            url = initialUrl,
            method = initialMethod,
            customHandleRequestSuccess = defaultHandleRequestSuccess,
        } = options;

        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios({
                url,
                method,
                data: method !== 'GET' ? data : undefined, // Include data only for non-GET requests
                headers: {
                    'Content-Type': 'application/json',
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
            console.error(`${method} request failed, url: ${url}, an error occurred:`, error.response.data);
        }

        setLoading(false);
    };

    return {
        responseData,
        requestData,
        setRequestData,
        makeRequest,
    };
};

export default useHttpRequest;
