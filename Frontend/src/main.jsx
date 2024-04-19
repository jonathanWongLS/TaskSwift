import React, { useState, useEffect, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
const Dashboard = lazy(() => import('./views/Dashboard/Dashboard'));
const SignIn = lazy(() => import('./views/SignIn/SignIn'));
const SignUp = lazy(() => import('./views/SignUp/SignUp'));
const Projects = lazy(() => import('./views/Projects/Projects'));
const Tasks = lazy(() => import('./views/Tasks/Tasks'));
const Loader = lazy(() => import('./components/Loader/Loader'));
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LuAxe } from 'react-icons/lu';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initialization time with a short delay
    const initializationTimeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the delay as needed

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(initializationTimeout);
  }, []);

  return (
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          {loading ? (
            <Loader />
          ) : (
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          )}
        </Router>
      </LocalizationProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
