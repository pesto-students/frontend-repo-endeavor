import Button from "../components/Button";
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
    const { handleLogin } = useContext(AuthContext);

    return (
        <>
            <h2>In the Home</h2>
            <Button onClickHandler={handleLogin} content="Sign in with Google" />
        </>
    );
}

export default Home;