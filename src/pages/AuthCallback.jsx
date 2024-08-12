import { useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AuthCallback = () => {
  const { handleLoginSuccess } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const authToken = searchParams.get('token');
    const userProfile = JSON.parse(decodeURIComponent(searchParams.get('user')));

    if (authToken && userProfile) {
      handleLoginSuccess(authToken, userProfile);
    }
  }, [searchParams, handleLoginSuccess]);

  return <div>Loading...</div>;
};

export default AuthCallback;
