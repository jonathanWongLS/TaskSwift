import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Dashboard from './views/Dashboard/Dashboard';
import SignIn from './views/SignIn/SignIn';
import SignUp from './views/SignUp/SignUp';
import Projects from './views/Projects/Projects';
import Tasks from './views/Tasks/Tasks';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(  
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks projectTitle="Project Alpha" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
