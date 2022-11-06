import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    createBrowserRouter,
    createHashRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from "react-router-dom";
import Home from "./page/Home";
import Register from "./page/Register";
import { Container, Nav, Navbar } from "react-bootstrap";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createHashRouter(
    createRoutesFromElements([
        <Route path="/" element={ <Home/> }/>
    ])
)

root.render(
    <Fragment>
        <Navbar bg="warning" variant="light" expand="lg">
            <Container>
                <Nav.Link href="/">Home</Nav.Link>
            </Container>
            <Navbar.Collapse>
                <Nav className="ms-auto container-fluid justify-content-end">
                    {/*<Button href="/login" variant="warning" className="ms-auto">Login</Button>*/ }
                    {/*<Button href="/register" variant="light" className="me-1 gray-button">Register</Button>*/ }
                    {/*<Button href="/login" variant="light" className="gray-button">Login</Button>*/ }
                </Nav>
            </Navbar.Collapse>
            {/*<Button href="/login" variant="warning">Login</Button>*/ }

        </Navbar>
        <RouterProvider router={ router }/>
    </Fragment>
);