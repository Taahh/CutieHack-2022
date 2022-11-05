import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Home from "./page/Home";
import Register from "./page/Register";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(
    createRoutesFromElements([
        <Route path="/" element={ <Home/> }/>,
        <Route path="/register" element={ <Register/> }/>
    ])
)

root.render(
    <React.StrictMode>
        <RouterProvider router={ router }/>
    </React.StrictMode>
);