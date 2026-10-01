import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function ErrorBoundary() {
  const error = useRouteError();
  
  console.error('Router error:', error);

  return (
    <div className="error-boundary">
      <FaExclamationTriangle size={48} color="#d32f2f" />
      <h1>Erreur inattendue</h1>
      
      {isRouteErrorResponse(error) ? (
        <>
          <h2>{error.status} - {error.statusText}</h2>
          <p>{error.data?.message || 'Erreur de routage'}</p>
        </>
      ) : error instanceof Error ? (
        <p>{error.message}</p>
      ) : (
        <p>Erreur inconnue</p>
      )}

      <Link to="/" className="home-link">
        Retour à l'accueil
      </Link>
    </div>
  );
}