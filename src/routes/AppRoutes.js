import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import DetailPage from '../pages/DetailPage';
import DetailPageNewEntry from '../pages/DetailPageNewEntry';
import NotFound from '../pages/NotFound';
import { AuthProvider } from '../contexts/AuthContext';
import AuthCallback from '../pages/AuthCallback';

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/signup" element={ <SignUp /> } />
          <Route path="/dashboard" element={ <Dashboard /> } />
          <Route path="/detailpage/:_id" element={ <DetailPage /> } />
          <Route path="/detailpage-newentry" element={ <DetailPageNewEntry /> } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;