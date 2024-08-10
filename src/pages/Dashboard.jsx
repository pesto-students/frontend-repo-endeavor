import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import NavBar from '../components/NavBar';
import NavMenu from '../components/NavMenu';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { isLoggedIn, user } = useContext(AuthContext);

    if (!isLoggedIn) {
        return <Navigate to='/' />;
    } else {
        if (!user.type) {
            return <Navigate to='/signup' />;
        }
    }

    return (
        <>
            <NavBar>
                <NavMenu userType={user.type} page="Dashboard" />
            </NavBar>
            <h2>In the Dashboard</h2>
        </>
    );  
}

export default Dashboard;