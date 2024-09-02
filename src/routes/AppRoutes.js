import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import BusinessDetail from '../pages/BusinessDetail';
import NotFound from '../pages/NotFound';
import AuthCallback from '../pages/AuthCallback';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/business/:_id" element={<BusinessDetail />} />
      <Route path="/business/new" element={<BusinessDetail />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;