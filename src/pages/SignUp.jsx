import { useContext, useState } from 'react';
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import axios from 'axios';

const SignUp = () => {
    const { isLoggedIn, user, setUser, loading, setLoading } = useContext(AuthContext);
    const [detailsAdded, setDetailsAdded] = useState(false);

    if (!isLoggedIn) {
        return <Navigate to='/' />;
    } else {
        if (user.type && detailsAdded) {
            return <Navigate to='/dashboard' />;
        }
    }

    const handleUserUpdateSuccess = (userProfile) => {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        // reset application loading status
        setLoading(false);
        setDetailsAdded(true);
    }

    const handleUserUpdate = async () => {
        // set application loading status
        setLoading(true);

        // Proceed further to send user update request to server
        try {
            // Retrieve the token from local storage
            const authToken = localStorage.getItem('authToken');

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/users/update`,
                {
                    email: user.email,
                    mobile: user.mobile,
                    city: user.city,
                    type: user.type,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                console.log('User updated successfully', response.data);
                handleUserUpdateSuccess(response.data.user);
            } else {
                console.error('User updation failed, status:', response.status, response.data)
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <>
            <NavBar>
                <NavMenu userType="common" page="SignUp" />
            </NavBar>
            <h2>In the Sign Up Page</h2>
            <input id='mobile' type='number' value={!user.mobile ? "" : user.mobile} onChange={(event) => setUser({ ...user, mobile: event.target.value })} placeholder='Enter Mobile' />
            <select id="city" name="city" value={!user.city ? "DEFAULT" : user.city} onChange={(event) => setUser({ ...user, city: event.target.value })} >
                <option value="DEFAULT" disabled>Choose city ...</option>
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
            </select>
            <select id="type" name="type" value={!user.type ? "DEFAULT" : user.type} onChange={(event) => setUser({ ...user, type: event.target.value })} >
                <option value="DEFAULT" disabled >Choose city ...</option>
                <option value="consumer">Consumer</option>
                <option value="business">Business</option>
            </select>
            {user.type && <Button onClickHandler={handleUserUpdate}>{user.type == "consumer" ? "submit" : "next"}</Button>}
        </>
    );
}

export default SignUp;