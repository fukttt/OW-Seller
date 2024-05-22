import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

// pages 
import Items from './pages/Items';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import Login from './pages/Login';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Items />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/stats",
    element: <Stats />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
