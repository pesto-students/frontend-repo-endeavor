import './App.css';
import NavBar from './components/NavBar/NavBar';
import { ApiProvider } from './contexts/ApiContext';
import { AppProvider } from './contexts/AppContext';
import AppRoutes from './routes/AppRoutes';


function App() {
  return (
    <AppProvider>
      <ApiProvider>
        <NavBar />
        <AppRoutes />
      </ApiProvider>
    </AppProvider>
  );
}

export default App;
