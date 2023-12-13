import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from './pages/Login/Login.jsx';
import Setting from './pages/Setting/Setting.jsx';
import Signup from './pages/Signup/Signup.jsx'
import Profile from './pages/Profile/Profile.jsx';
import Home from './pages/Home/Home.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/setting/:username',
    element: <Setting />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/home/:username',
    element: <Home />
  },
  {
    path: '/profile/:username',
    element: <Profile/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
