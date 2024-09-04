import { Navigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import signup from '../assets/icons/signup.svg';
import { AppContext } from "../contexts/AppContext";

const Home = () => {
    const { loggedIn } = useContext(AppContext);
    const { handleLogin } = useContext(AuthContext);

    if (loggedIn) {
        return <Navigate to='/dashboard' />;
    }

    return (
        <div>
            <img src={signup} alt="signup" onClick={handleLogin} />
        </div>
    );
}

export default Home;