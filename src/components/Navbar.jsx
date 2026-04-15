// =============================================================================
// Navbar.jsx — THE NAVIGATION BAR (only shown when logged in)
// =============================================================================
// This component renders the dark top bar using Bootstrap's navbar classes.
// It is only rendered inside the authenticated branch of App.jsx, so guests
// never see it.
//
// KEY CONCEPTS:
//   - <Link> from react-router-dom: works like an <a> tag but does NOT reload
//     the page. It updates the URL and React Router renders the matching route.
//   - useNavigate(): a hook that returns a function to programmatically
//     navigate (e.g. after logout, redirect to home).
//   - Conditional rendering with {user && (...)} — only renders the JSX
//     inside if "user" is truthy.
//   - Bootstrap responsive collapse: on small screens, the nav links are
//     hidden behind a "hamburger" button. Clicking it toggles visibility.
//     This requires Bootstrap's JS (imported in main.jsx).
// =============================================================================

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  // Destructure user data and the logout function from our auth context
  const { user, logout } = useAuth();

  // useNavigate returns a function we can call to change the current route
  const navigate = useNavigate();

  // When the user clicks "Logout": clear auth state, then redirect to "/"
  // (which will resolve to /login since App.jsx switches to guest routes)
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    // "navbar-expand-lg" means: show full nav on large screens,
    // collapse into hamburger on smaller screens
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Brand/logo — links to home page */}
        <Link className="navbar-brand" to="/">🍳 Recipe Book</Link>

        {/* Hamburger button — only visible on small screens.
            data-bs-toggle and data-bs-target are Bootstrap attributes
            that tell Bootstrap JS which element to show/hide. */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible area — hidden on small screens until toggler is clicked */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left-side links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {/* "Add Recipe" link — only shown if user is logged in.
                Since Navbar is only rendered for logged-in users anyway,
                this check is technically redundant here but kept for clarity. */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/recipes/new">Add Recipe</Link>
              </li>
            )}
          </ul>

          {/* Right-side links */}
          <ul className="navbar-nav">
            {user ? (
              <>
                {/* Greeting — uses a <span> instead of <Link> because
                    it's not clickable, just informational */}
                <li className="nav-item">
                  <span className="nav-link text-light">Hello, {user.name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm mt-1" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
