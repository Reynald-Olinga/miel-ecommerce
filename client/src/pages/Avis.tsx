import React from 'react';
import { Link } from 'react-router-dom';

const Avis: React.FC = () => (
  <div className="page">
    <h2>Avis Clients</h2>
    <p>Ce que nos clients disent de nous.</p>
    {/* Témoignages à intégrer via API plus tard */}
    
    {/* Liens de navigation sans reload */}
    <nav className="nav-links">
      <Link to="/" className="nav-link">Accueil</Link>
      <Link to="/boutique" className="nav-link">Boutique</Link>
      <Link to="/blog" className="nav-link">Blog</Link>
      <Link to="/login" className="nav-link">Connexion</Link>
    </nav>
  </div>
)

export default Avis












// import React from 'react'


// const Avis: React.FC = () => (
//   <div className="page">
//     <h2>Avis Clients</h2>
//     <p>Ce que nos clients disent de nous.</p>
//     {/* Témoignages à intégrer via API plus tard */}
//   </div>
// )

// export default Avis
