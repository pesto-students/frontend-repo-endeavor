import { useContext, useState } from "react";
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from "react-router-dom";
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import Button from '../components/Button';
import useHttpRequest from '../hooks/useHttpRequest';

const DetailPageNewEntry = () => {
    const { loggedIn, user } = useContext(AuthContext);
    const [detailsAdded, setDetailsAdded] = useState(false);
    const initialBusinessDetail = { user_id: user.email, city: user.city,
        category: null, name: null, owner: null, email: user.email,
        mobile: user.mobile, service: [], address: null, logo: null, gallery: []
    };
    const initialData = { collectionName: "business", data: initialBusinessDetail };
    const initialUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/insert`;
    const initialMethod = 'POST';
    const { requestData, setRequestData, makeRequest } = useHttpRequest(initialData, initialUrl, initialMethod);

    if (!loggedIn) {
        return <Navigate to='/' />;
    } else {
        if (detailsAdded) {
            return <Navigate to='/dashboard' />;
        }
    }

    const handleBusinessNewEntrySuccess = (response) => {
        // allow application to proceed further
        setDetailsAdded(true);
    }

    const handleBusinessNewEntry = async () => {
        makeRequest({ customHandleRequestSuccess: handleBusinessNewEntrySuccess });
    }

    return (
        <>
            <NavBar>
                <NavMenu userType="business" page="DetailPageNewEntry" />
            </NavBar>
            <h2>In the Sign Up Page</h2>
            <h3>Enter Business Detail:</h3>
            <div style={{display: "flex", flexDirection: "column", width: "50%"}}>
                <select value={!requestData.data.city ? "DEFAULT" : requestData.data.city} onChange={(event) => setRequestData({ ...requestData, data: { ...requestData.data, city: event.target.value }})} >
                    <option value="DEFAULT" disabled>Choose city ...</option>
                    <option value="delhi">Delhi</option>
                    <option value="mumbai">Mumbai</option>
                </select>
                <select value={!requestData.data.category ? "DEFAULT" : requestData.data.category} onChange={(event) => setRequestData({ ...requestData, data: { ...requestData.data, category: event.target.value }})} >
                    <option value="DEFAULT" disabled >Choose category ...</option>
                    <option value="consumer">Automobile</option>
                    <option value="business">Electronics</option>
                </select>
                <input type='text' value={!requestData.data.name ? "" : requestData.data.name} onChange={(event) => setRequestData({ ...requestData, data: { ...requestData.data, name: event.target.value }})} placeholder='Enter Business Name' />
                <input type='text' value={!requestData.data.owner ? "" : requestData.data.owner} onChange={(event) => setRequestData({ ...requestData, data: { ...requestData.data, owner: event.target.value }})} placeholder='Enter Owner Name' />
                <input type='text' value={!requestData.data.email ? "" : requestData.data.email} onChange={(event) => setRequestData({ ...requestData, data: { ...requestData.data, email: event.target.value }})} placeholder='Enter Email' />
                <input type='number' value={!requestData.data.mobile ? "" : requestData.data.mobile} onChange={(event) => setRequestData({ ...requestData, data: { ...requestData.data, mobile: event.target.value }})} placeholder='Enter Mobile' />
                <input type='text' value={!requestData.data.address ? "" : requestData.data.address} onChange={(event) => setRequestData({ ...requestData, data: { ...requestData.data, address: event.target.value }})} placeholder='Enter Address' />
                <Button onClickHandler={(handleBusinessNewEntry)}>next</Button>
            </div>
        </>
    );
};

export default DetailPageNewEntry;