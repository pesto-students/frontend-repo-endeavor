import {  BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import { AppProvider } from './contexts/AppContext';
import AppRoutes from './routes/AppRoutes';
import { ApiProvider } from './contexts/ApiContext';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <Router>
      <AppProvider>
        <ApiProvider>
          <AuthProvider>
            <NavBar />
            <AppRoutes />
          </AuthProvider>
        </ApiProvider>
      </AppProvider>
    </Router>
  );
}

export default App;
