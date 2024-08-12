import { useContext, useState } from 'react';
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import useHttpRequest from '../hooks/useHttpRequest';

const SignUp = () => {
    const { loggedIn, user, setUser } = useContext(AuthContext);
    const initialData = { collectionName: "user", query: { email: user.email }, updateFields: { mobile: user.mobile, city: user.city, type: user.type }, projection: { name: 1, mobile: 1, city: 1, email: 1, image: 1, type: 1 } };
    const initialUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/update`;
    const initialMethod = 'PATCH';
    const { requestData, setRequestData, makeRequest } = useHttpRequest(initialData, initialUrl, initialMethod);
    const detailsAdded = JSON.parse(localStorage.getItem('userProfile')).type ? true : false;

    console.log(loggedIn, detailsAdded)

    if (!loggedIn) {
        return <Navigate to='/' />;
    } else {
        if (detailsAdded) {
            if (requestData.updateFields.type === "consumer") {
                return <Navigate to='/dashboard' />;
            } else if (requestData.updateFields.type === "business") {
                return <Navigate to='/detailpage-newentry' />;
            }
        }
    }

    const handleUserUpdateSuccess = (response) => {
        const updatedUserProfile = response.data.document;
        localStorage.setItem('userProfile', JSON.stringify(updatedUserProfile));
        setUser(updatedUserProfile);
    }

    const handleUserUpdate = async () => {
        makeRequest({ customHandleRequestSuccess: handleUserUpdateSuccess });
    }

    return (
        <>
            <NavBar>
                <NavMenu userType="common" page="SignUp" />
            </NavBar>
            <h2>In the Sign Up Page</h2>
            <input value={!requestData.updateFields.mobile ? "" : requestData.updateFields.mobile} onChange={(event) => setRequestData({ ...requestData, updateFields: { ...requestData.updateFields, mobile: event.target.value }})} placeholder='Enter Mobile' />
            <select value={!requestData.updateFields.city ? "DEFAULT" : requestData.updateFields.city} onChange={(event) => setRequestData({ ...requestData, updateFields: { ...requestData.updateFields, city: event.target.value }})} >
                <option value="DEFAULT" disabled>Choose city ...</option>
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
            </select>
            <select value={!requestData.updateFields.type ? "DEFAULT" : requestData.updateFields.type} onChange={(event) => setRequestData({ ...requestData, updateFields: { ...requestData.updateFields, type: event.target.value }})} >
                <option value="DEFAULT" disabled>Choose user type ...</option>
                <option value="consumer">Consumer</option>
                <option value="business">Business</option>
            </select>
            {requestData.updateFields.type && <Button onClickHandler={handleUserUpdate}>{requestData.updateFields.type === "consumer" ? "submit" : "next"}</Button>}
        </>
    );
}

export default SignUp;