// =============================================================================
// ProtectedRoute.jsx — ROUTE GUARD (no longer actively used)
// =============================================================================
// This component was originally used to wrap individual routes that required
// authentication. It checks if a user is logged in; if not, it redirects
// to /login.
//
// CURRENT STATUS:
//   After refactoring App.jsx to split into two completely separate route
//   trees (guest vs. authenticated), this component is no longer needed.
//   It's kept here for reference as an example of the "protected route"
//   pattern, which is very common in React apps.
//
// HOW IT WOULD BE USED:
//   <Route path="/recipes/new" element={
//     <ProtectedRoute>
//       <RecipeForm />
//     </ProtectedRoute>
//   } />
//
// HOW IT WORKS:
//   - "children" is whatever JSX is placed between <ProtectedRoute>...</ProtectedRoute>
//   - If user exists → render the children (the protected page)
//   - If user is null → render <Navigate to="/login"> which redirects
//     the browser to the login page. "replace" means it replaces the
//     current history entry (so pressing Back won't loop back here).
// =============================================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
