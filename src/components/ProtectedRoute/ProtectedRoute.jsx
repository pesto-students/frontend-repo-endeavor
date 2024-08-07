import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    // const { isLoggedIn, loading } = useContext(AuthContext);
    const { isLoggedIn } = useContext(AuthContext);

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;