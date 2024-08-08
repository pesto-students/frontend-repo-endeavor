import Button from '../components/Button';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
    const { handleLogout } = useContext(AuthContext);

    return (
        <>
            <h2>In the Dashboard</h2>
            <Button onClickHandler={handleLogout} content="Logout" ></Button>
        </>
    );
}

export default Dashboard;