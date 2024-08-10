import { useContext } from 'react';
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const SignUp = () => {
    const { isLoggedIn, user, loading, setLoading } = useContext(AuthContext);

    if (!isLoggedIn) {
        return <Navigate to='/' />;
    } else {
        if (user.type) {
            return <Navigate to='/dashboard' />;
        }
    }

    return (
        <>
            <NavBar>
                <NavMenu user_type="common" page="SignUp" />
            </NavBar>
            <h2>In the Sign Up Page</h2>
            <input id='mobile' type='number' />
            <select id="type" name="type">
                <option value="consumer">Consumer</option>
                <option value="business">Business</option>
            </select>
            <select id="city" name="city">
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
            </select>
        </>
    );
}

export default SignUp;