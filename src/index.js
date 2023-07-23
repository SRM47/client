import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import Root from './routes/root';
import Room from './routes/room';
import reportWebVitals from './reportWebVitals';
import ErrorPage from "./error-page";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path:"/play/:roomId?",
    element: <Room />,
    errorElement: <ErrorPage />
  }
]);

createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <RouterProvider router={router} />
  // </React.StrictMode>
  <>
    <RouterProvider router={router} />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
