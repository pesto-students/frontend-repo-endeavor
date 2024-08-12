import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import { Navigate, useNavigate } from 'react-router-dom';
import useHttpRequest from '../hooks/useHttpRequest';

const Dashboard = () => {
    const { loggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const initialData = { collectionName: "business", page: 1, limit: 10, filter: {}, projection: { name: 1 }, sortBy: { updated_at: -1, created_at: -1 } };
    const initialUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/search`;
    const initialMethod = 'POST';
    const { requestData, responseData, setRequestData, makeRequest } = useHttpRequest(initialData, initialUrl, initialMethod);


    // load default businesses based on user type
    useEffect(() => {
        if (loggedIn && JSON.stringify(requestData.filter) === '{}') {
            if (user.type === "consumer") {
                setRequestData({
                    ...requestData,
                    filter: {
                        ...requestData.filter,
                        city: user.city
                    }
                });
            } else if (user.type === "business") {
                setRequestData({
                    ...requestData,
                    filter: {
                        ...requestData.filter,
                        user_id: user.email
                    }
                });
            }
        }
        if (JSON.stringify(requestData.filter) !== '{}') {
            makeRequest();
        }
    }, [requestData]);

    if (!loggedIn) {
        return <Navigate to='/' />;
    } else {
        if (!user.type) {
            return <Navigate to='/signup' />;
        }
    }

    const businesses = responseData && responseData.documents;
    const businessesSummary = businesses && businesses.map((business) => (
        <div key={business._id} onClick={() => navigate(`/detailpage/${business._id}`)}>{
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