import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import BusinessSummary from '../components/BusinessSummary/BusinessSummary';
import FilterPanel from '../components/FilterPanel';
import LabelledBox from '../components/IO/LabelledBox';
import { Rating } from '@mui/material';

const Dashboard = () => {
    const { loggedIn, user, setCurrentMenuConfig } = useContext(AppContext);
    const { makeRequest } = useContext(ApiContext);
    const { handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const defaultSearchParam = { 
        page: 1, 
        limit: 10, 
        filter: user.type === "consumer" ? { city: user.city, rating: { $gte: 0} } : { user_id: user._id, rating: { $gte: 0} },
        projection: { name: 1, service: 1, rating: 1 }, 
        sortBy: { updated_at: -1, created_at: -1 } 
    };
    const [searchParam, setSearchParam] = useState(defaultSearchParam);
    const [businesses, setBusinesses] = useState([]);

    useEffect(() => {
        const searchUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/business/search`;
        const searchMethod = 'POST';
        makeRequest({ 
            data: searchParam, 
            url: searchUrl, 
            method: searchMethod, 
            customHandleRequestSuccess: (response) => {
                const documents = response.data && response.data.documents;
                if (Array.isArray(documents)) {
                    setBusinesses(documents);
                }
            }
        });
    }, [searchParam]);

    useEffect(() => {
        let customMenuConfig = [
            { label: 'Logout', handler: handleLogout }
        ];

        if (user.type === "business") {
            customMenuConfig = [
                { label: 'New', handler:  () => navigate('/business/new') },
                ...customMenuConfig
            ]
        }

        setCurrentMenuConfig(customMenuConfig);
    },[businesses]);

    if (!loggedIn) {
        return <Navigate to='/' />;
    } else {
        if (!user.type) {
            return <Navigate to='/signup' />;
        }
    }

    return (
        <div style={ { display: "flex", flexDirection: "row-reverse" } }>
            <div style={ { display: "flex", flexDirection: "column", width: "60vw", padding: "40px", gap: "10px" } }>
                {businesses.map((businessDetail) => <BusinessSummary key={businessDetail._id} businessDetail={businessDetail} onClickHandler={() => navigate(`/business/${businessDetail._id}`)}/>)}
            </div>
            <div style={ { display: "flex", flexDirection: "column", width: "40vw", padding: "40px" } }>
                <FilterPanel defaultSearchParam={defaultSearchParam} searchParam={searchParam} setSearchParam={setSearchParam} />
                {
                    user.type === "business" && 
                    <LabelledBox label={user.name}>
                        <Rating  value={user.rating} precision={0.5} readOnly={true} />
                    </LabelledBox>
                }
            </div>
        </div>
    );
}

export default Dashboard;