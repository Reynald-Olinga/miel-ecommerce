// client/src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthCtx } from '../context/AuthContext';

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');

  return {
    ...ctx,
    isAuthenticated: !!ctx.token && !!ctx.user, // <- ici
  };
};

















// // client/src/hooks/useAuth.ts
// import { useContext } from 'react';
// import { AuthCtx } from '../context/AuthContext';

// export const useAuth = () => {
//   const ctx = useContext(AuthCtx);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// };