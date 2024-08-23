import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import SignIn from './pages/backoffice/SignIn'
import Home from './pages/backoffice/Home';
import Product from './pages/backoffice/Product';
import BillSale from './pages/backoffice/BillSale';
import DashBoard from './pages/backoffice/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn/>
  },
  {
    path: '/home',
    element: <Home/>
  },
  {
    path: '/product',
    element: <Product/>
  },
  {
    path: '/BillSale',
    element: <BillSale/>
  },
  {
    path: '/dashboard',
    element: <DashBoard/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);