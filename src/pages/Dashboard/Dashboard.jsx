import axios from 'axios';
import Button from '../../components/Button';

const Dashboard = () => {
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/auth/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                window.location.href = process.env.REACT_APP_FRONTEND_DOMAIN;
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div>
            <h2>In the Dashboard</h2>
            <Button onClickHandler={handleLogout} content="Logout" ></Button>
        </div>
    );
}

export default Dashboard;