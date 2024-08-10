import { Navigate } from "react-router-dom";
import Button from "../components/Button";
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import NavMenu from "../components/NavMenu";
import NavBar from "../components/NavBar";

const Home = () => {
    const { handleLogin, isLoggedIn } = useContext(AuthContext);

    if (isLoggedIn) {
        return <Navigate to='/signup' />;
    }

    return (
        <>
            <NavBar>
                <NavMenu user_type={"common"} page={"Home"} />
            </NavBar>
            <h2>In the Home</h2>
            <Button onClickHandler={handleLogin} >Sign in with Google</Button>
        </>
    );
}

export default Home;