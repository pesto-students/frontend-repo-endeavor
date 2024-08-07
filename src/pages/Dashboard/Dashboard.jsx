import Button from '../../components/Button';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const Dashboard = () => {
    const { handleLogout } = useContext(AuthContext);

    return (
        <div>
            <h2>In the Dashboard</h2>
            <Button onClickHandler={handleLogout} content="Logout" ></Button>
        </div>
    );
}

export default Dashboard;