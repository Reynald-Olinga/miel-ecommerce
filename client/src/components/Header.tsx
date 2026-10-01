// client/src/components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/UseCart';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <header className="header">
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/boutique">Boutique</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/avis">Avis Clients</Link>
        <Link to="/panier">Panier</Link>
        
        {isAdmin && (
          <Link to="/admin/stocks" className="admin-link">
            Gestion des stocks
          </Link>
        )}

        {isAuthenticated ? (
          <>
            <button onClick={logout}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/signup">
              <span role="img" aria-label="honey">🍯</span> S'inscrire
            </Link>
            <Link to="/login">Connexion</Link>
          </>
        )}
      </nav>

      {cartItems && (
        <div className="cart-icon">
          <Link to="/panier">Panier ({cartItems.length})</Link>
        </div>
      )}
    </header>
  );
};

export default Header;









