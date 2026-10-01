import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export default function ErrorPage({ status = 500 }) {
  const error = useRouteError();
  
  return (
    <div className="error-page">
      <h1>Erreur {isRouteErrorResponse(error) ? error.status : status}</h1>
      <p>
        {isRouteErrorResponse(error)
          ? error.data
          : (error as Error)?.message || 'Une erreur est survenue'}
      </p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}