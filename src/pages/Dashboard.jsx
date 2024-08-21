import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import { Navigate, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { loggedIn, user } = useContext(AuthContext);
    const { makeRequest } = useContext(ApiContext);
    const initSearchParam = { collectionName: "business", page: 1, limit: 10, filter: user.type === "consumer" ? { city: user.city } : user.type === "business" ? { user_id: user.email } : {}, projection: { name: 1 }, sortBy: { updated_at: -1, created_at: -1 } };
    const [searchParam, setSearchParam] = useState(initSearchParam);
    const searchUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/search`;
    const searchMethod = 'POST';
    const [responseData, setResponseData] = useState(null);
    const navigate = useNavigate();


    // load default businesses based on user type
    useEffect(() => {
        makeRequest({ 
            data: searchParam, 
            url: searchUrl, 
            method: searchMethod, 
            customHandleRequestSuccess: (response) => {
                setResponseData(response.data);
            }
        });
    }, [searchParam]);

    if (!loggedIn) {
        return <Navigate to='/' />;
    } else {
        if (!user.type) {
            return <Navigate to='/signup' />;
        }
    }

    const businesses = responseData && responseData.documents;
    const businessesSummary = businesses && businesses.map((business) => (
        <div key={business._id} onClick={() => navigate(`/business/${business._id}`)}>{
            Object.keys(business).map((key) => (
                <p key={key}>{key}: {business[key]}</p>
            ))}
        </div>
    ));

    return (
        <>
            <NavBar>
                <NavMenu userType={user.type} page="Dashboard" />
            </NavBar>
            <h2>In the Dashboard</h2>
            {businessesSummary}
        </>
    );
}

export default Dashboard;