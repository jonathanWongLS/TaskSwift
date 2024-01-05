import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Dashboard from './views/Dashboard';
import SignIn from './views/SignIn';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/sign-in",
    element: <SignIn />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(  
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
