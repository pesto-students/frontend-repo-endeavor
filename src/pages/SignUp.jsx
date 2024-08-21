import { useContext, useState } from 'react';
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import Button from '../components/Button';

const SignUp = () => {
    const { loggedIn, user, setUser } = useContext(AuthContext);
    const { makeRequest } = useContext(ApiContext);
    const initUserProfile = { collectionName: "user", query: { email: user.email }, updateFields: { mobile: user.mobile, city: user.city, type: user.type }, projection: { name: 1, mobile: 1, city: 1, email: 1, image: 1, type: 1 } };
    const [userProfile, setUserProfile] = useState(initUserProfile);
    const updateUrl = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/update`;
    const updateMethod = 'PATCH';
    const detailsAdded = JSON.parse(localStorage.getItem('userProfile')).type ? true : false;

    

    if (!loggedIn) {
        return <Navigate to='/' />;
    } else {
        if (detailsAdded) {
            if (userProfile.updateFields.type === "consumer") {
                return <Navigate to='/dashboard' />;
            } else if (userProfile.updateFields.type === "business") {
                return <Navigate to='/business/new' />;
            }
        }
    }

    const handleUserUpdate = async () => {
        makeRequest({ 
            data: userProfile, 
            url: updateUrl, 
            method: updateMethod, 
            customHandleRequestSuccess: (response) => {
                const updatedUserProfile = response.data.document;
                localStorage.setItem('userProfile', JSON.stringify(updatedUserProfile));
                setUser(updatedUserProfile);
            }
        });
    }

    return (
        <>
            <NavBar>
                <NavMenu userType="common" page="SignUp" />
            </NavBar>
            <h2>In the Sign Up Page</h2>
            <input value={!userProfile.updateFields.mobile ? "" : userProfile.updateFields.mobile} onChange={(event) => setUserProfile({ ...userProfile, updateFields: { ...userProfile.updateFields, mobile: event.target.value }})} placeholder='Enter Mobile' />
            <select value={!userProfile.updateFields.city ? "DEFAULT" : userProfile.updateFields.city} onChange={(event) => setUserProfile({ ...userProfile, updateFields: { ...userProfile.updateFields, city: event.target.value }})} >
                <option value="DEFAULT" disabled>Choose city ...</option>
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
            </select>
            <select value={!userProfile.updateFields.type ? "DEFAULT" : userProfile.updateFields.type} onChange={(event) => setUserProfile({ ...userProfile, updateFields: { ...userProfile.updateFields, type: event.target.value }})} >
                <option value="DEFAULT" disabled>Choose user type ...</option>
                <option value="consumer">Consumer</option>
                <option value="business">Business</option>
            </select>
            {userProfile.updateFields.type && <Button onClickHandler={handleUserUpdate}>{userProfile.updateFields.type === "consumer" ? "submit" : "next"}</Button>}
        </>
    );
}

export default SignUp;