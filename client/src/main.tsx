import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/global.css';
import { AuthProvider } from './context/AuthContext';

// Composants & pages
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Boutique from './pages/Boutique';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Avis from './pages/Avis';
import ProductCart from './pages/ProductCart';
import OrderConfirmation from './pages/Orderconfirmation';
import Signup from './pages/auth/Sign_up/Signup';
import Login from './pages/auth/Login/Login';
import AdminStockPage from './pages/AdminStockPage';
import ErrorPage from './pages/ErrorPage';
import PrivateRoute from './components/PrivateRoute';

// Pages d'authentification
import ForgotPassword from './pages/auth/Login/ForgotPassword';
import ResetPassword from './pages/auth/Login/ResetPassword';

const Protected = ({ children }: { children: React.ReactNode }) => (
  <PrivateRoute>{children}</PrivateRoute>
);

const router = createBrowserRouter([
  // Routes avec Layout (style global)
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'nos-miels', element: <ProductList /> },
      { path: 'boutique', element: <Boutique /> },
      { path: 'blog', element: <Blog /> },
      { path: 'contact', element: <Contact /> },
      { path: 'avis', element: <Avis /> },
      { path: 'panier', element: <Protected><ProductCart /></Protected> },
      { path: 'confirmation', element: <Protected><OrderConfirmation /></Protected> },
      {
        path: 'admin/stocks',
        element: (
          <Protected>
            <AdminStockPage />
          </Protected>
        ),
      },
    ],
  },

  // Routes d'authentification sans Layout (style différent)
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password/:token', element: <ResetPassword /> },

  // Catch-all pour les erreurs 404 (doit être en dernier)
  { path: '*', element: <ErrorPage status={404} /> },
], {
  basename: import.meta.env.BASE_URL,  // 👈 AJOUT : '/' en dev, '/miel-ecommerce/' en build
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={<div>Chargement…</div>} />
    </AuthProvider>
  </React.StrictMode>
);