import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const RedirectIfLoggedIn = ({ children }) => {
    const { isLoggedIn, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isLoggedIn) {
            navigate('/dashboard');
        }
    }, [loading, isLoggedIn, navigate]);

    if (loading || isLoggedIn) {
        return null;
    }

    return children;
};

export default RedirectIfLoggedIn;