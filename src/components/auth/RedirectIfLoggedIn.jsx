import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const RedirectIfLoggedIn = ({ children }) => {
    const { isLoggedIn, loading, navigate } = useContext(AuthContext);

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