import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import NotFound from '../pages/NotFound/NotFound';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';
import RedirectIfLoggedIn from '../components/RedirectIfLoggedIn/RedirectIfLoggedIn';
import AuthCallback from '../callbacks/AuthCallback/AuthCallback';

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/"
            element={
              <RedirectIfLoggedIn>
                <Home />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;