import { useContext, useState } from "react";
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from "react-router-dom";
import axios from 'axios';
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import Button from '../components/Button';

const DetailPageNewEntry = () => {
    const { isLoggedIn, user, setUser, setLoading } = useContext(AuthContext);
    const [detailsAdded, setDetailsAdded] = useState(false);
    const [businessDetail, setBusinessDetail] = useState({
        user_id: user.email,
        city: user.city,
        category: null,
        name: null,
        owner: null,
        email: user.email,
        mobile: user.mobile,
        service: [],
        address: null,
        logo: null,
        gallery: []
    });

    if (!isLoggedIn) {
        return <Navigate to='/' />;
    } else {
        if (detailsAdded) {
            return <Navigate to='/dashboard' />;
        }
    }

    const handleBusinessNewEntrySuccess = (userProfile) => {
        // reset application loading status
        setDetailsAdded(true);
    }

    const handleBusinessNewEntry = async () => {
        // set application loading status
        setLoading(true);

        // Proceed further to send user update request to server
        try {
            // Retrieve the token from local storage
            const authToken = localStorage.getItem('authToken');

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/business/insert`,
                businessDetail,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                console.log('Business added successfully', response.data);
                handleBusinessNewEntrySuccess();
            } else {
                console.error('Business addition failed, status:', response.status, response.data)
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }

        setLoading(false);
    }

    return (
        <>
            <NavBar>
                <NavMenu userType="business" page="DetailPageNewEntry" />
            </NavBar>
            <h2>In the Sign Up Page</h2>
            <h3>Enter Business Detail:</h3>
            <div style={{display: "flex", flexDirection: "column", width: "50%"}}>
                <select value={!businessDetail.city ? "DEFAULT" : businessDetail.city} onChange={(event) => setBusinessDetail({ ...businessDetail, city: event.target.value })} >
                    <option value="DEFAULT" disabled>Choose city ...</option>
                    <option value="delhi">Delhi</option>
                    <option value="mumbai">Mumbai</option>
                </select>
                <select value={!businessDetail.category ? "DEFAULT" : businessDetail.category} onChange={(event) => setBusinessDetail({ ...businessDetail, category: event.target.value })} >
                    <option value="DEFAULT" disabled >Choose category ...</option>
                    <option value="consumer">Automobile</option>
                    <option value="business">Electronics</option>
                </select>
                <input type='text' value={!businessDetail.name ? "" : businessDetail.name} onChange={(event) => setBusinessDetail({ ...businessDetail, name: event.target.value })} placeholder='Enter Business Name' />
                <input type='text' value={!businessDetail.owner ? "" : businessDetail.owner} onChange={(event) => setBusinessDetail({ ...businessDetail, owner: event.target.value })} placeholder='Enter Owner Name' />
                <input type='text' value={!businessDetail.email ? "" : businessDetail.email} onChange={(event) => setBusinessDetail({ ...businessDetail, email: event.target.value })} placeholder='Enter Email' />
                <input type='number' value={!businessDetail.mobile ? "" : businessDetail.mobile} onChange={(event) => setBusinessDetail({ ...businessDetail, mobile: event.target.value })} placeholder='Enter Mobile' />
                <input type='text' value={!businessDetail.address ? "" : businessDetail.address} onChange={(event) => setBusinessDetail({ ...businessDetail, address: event.target.value })} placeholder='Enter Address' />
                <Button onClickHandler={handleBusinessNewEntry}>next</Button>
            </div>
        </>
    );
};

export default DetailPageNewEntry;