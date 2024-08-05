import Button from "../../components/Button";

const Home = () => {
    const handleLogin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_DOMAIN}/api/v1/auth/login/federated/google`;
    };

    return (
        <div>
            <h2>In the Home</h2>
            <Button onClickHandler={handleLogin} content="Sign in with Google" />
        </div>
    );
}

export default Home;