import './App.css';
import { ApiProvider } from './contexts/ApiContext';
import { AppProvider } from './contexts/AppContext';
import AppRoutes from './routes/AppRoutes';


function App() {
  return (
    <AppProvider>
      <ApiProvider>
        <AppRoutes />
      </ApiProvider>
    </AppProvider>
  );
}

export default App;
