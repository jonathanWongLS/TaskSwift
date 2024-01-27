import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Dashboard from './views/Dashboard/Dashboard';
import SignIn from './views/SignIn/SignIn';
import SignUp from './views/SignUp/SignUp';
import Projects from './views/Projects/Projects';
import Tasks from './views/Tasks/Tasks';
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
  },
  {
    path: "/sign-up",
    element: <SignUp />
  },
  {
    path: "/projects",
    element: <Projects />
  },
  {
    path: "/tasks",
    element: <Tasks projectTitle='Project Alpha'/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(  
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
