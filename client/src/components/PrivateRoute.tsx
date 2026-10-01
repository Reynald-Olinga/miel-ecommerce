import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  console.log('[PrivateRoute] token lu dans localStorage →', token ? `${token.slice(0, 10)}…` : 'undefined');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;































// import React from 'react';
// import { Navigate } from 'react-router-dom';

// interface PrivateRouteProps {
//   children: React.ReactNode;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
//   const token = localStorage.getItem('authToken');
  
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

// export default PrivateRoute;





