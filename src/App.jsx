// =============================================================================
// App.jsx — THE ROOT COMPONENT (decides what to show based on auth state)
// =============================================================================
// This component is the "traffic controller" of the application. It checks
// whether the user is logged in and renders a completely different set of
// routes depending on that.
//
//   NOT logged in  →  can only see Login and Register pages (no navbar)
//   Logged in      →  sees the Navbar + Home, Recipe Detail, Add/Edit pages
//
// KEY REACT CONCEPTS USED HERE:
//   - Conditional rendering (if/else to return different JSX)
//   - React Router's <Routes> and <Route> for page navigation
//   - <Navigate> for automatic redirects
//   - Custom hook (useAuth) to read authentication state
// =============================================================================

import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './pages/RecipeForm';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  // useAuth() is our custom hook — it returns { user, login, logout }.
  // Here we only need "user" to decide which routes to show.
  const { user } = useAuth();

  // ---------- GUEST VIEW (not logged in) ----------
  // If there is no user, we show only the login/register pages.
  // The wildcard route path="*" catches ANY other URL and redirects to /login.
  // This means a guest can never reach /recipes/new or any other page.
  if (!user) {
    return (
      <main className="container mt-4 mb-5">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Any unknown URL → redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    );
  }

  // ---------- AUTHENTICATED VIEW (logged in) ----------
  // The Navbar is only rendered here, so guests never see it.
  // <> ... </> is a React Fragment — a wrapper that doesn't create an
  // extra DOM element. We need it because JSX requires a single parent.
  return (
    <>
      <Navbar />
      <main className="container mt-4 mb-5">
        <Routes>
          {/* Home page — shows all recipes */}
          <Route path="/" element={<Home />} />

          {/* Dynamic route — :id is a URL parameter (e.g. /recipes/3).
              The RecipeDetail component reads it with useParams(). */}
          <Route path="/recipes/:id" element={<RecipeDetail />} />

          {/* Add new recipe form */}
          <Route path="/recipes/new" element={<RecipeForm />} />

          {/* Edit existing recipe — reuses the same RecipeForm component.
              The component checks whether "id" exists in the URL to decide
              if it's creating or editing. */}
          <Route path="/recipes/:id/edit" element={<RecipeForm />} />

          {/* Any unknown URL → redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
