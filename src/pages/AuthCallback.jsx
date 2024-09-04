import { useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AuthCallback = () => {
  const { handleLoginSuccess } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let accessToken = null;
    let refreshToken = null;
    if (process.env.REACT_APP_AUTH_TOKEN_STORAGE === "localstorage") {
      accessToken = searchParams.get('accessToken');
      refreshToken = searchParams.get('refreshToken');
    }
    const userProfile = JSON.parse(decodeURIComponent(searchParams.get('userProfile')));

    handleLoginSuccess(accessToken, refreshToken, userProfile);
  }, [searchParams, handleLoginSuccess]);

  return <div>Loading...</div>;
};

export default AuthCallback;
