// =============================================================================
// main.jsx — THE ENTRY POINT OF THE ENTIRE APPLICATION
// =============================================================================
// This is the very first file that runs. Think of it as the "ignition key" of
// the app. It does three things:
//   1. Imports global styles (Bootstrap CSS/JS and our custom CSS)
//   2. Wraps the app in "providers" that give every component access to
//      routing (<BrowserRouter>) and authentication (<AuthProvider>)
//   3. Renders everything into the <div id="root"> in index.html
// =============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';

// BrowserRouter enables client-side routing — it lets us navigate between
// pages without a full page reload. Every <Link> and useNavigate() call
// in the app depends on this wrapper being here.
import { BrowserRouter } from 'react-router-dom';

import App from './App';

// AuthProvider is our custom context provider. It makes the logged-in user's
// data (and the login/logout functions) available to EVERY component below it
// in the tree, without having to pass props down manually.
import { AuthProvider } from './contexts/AuthContext';

// Bootstrap CSS — gives us ready-made classes like "btn btn-primary",
// "card", "navbar", "container", etc.
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap JS — needed for interactive components like the collapsible
// hamburger menu on mobile. Without this, the navbar toggler button
// would not work.
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Our own small CSS file for custom styles that Bootstrap doesn't cover.
import './index.css';

// ReactDOM.createRoot() is the React 18+ way of mounting the app.
// It finds the <div id="root"> in index.html and renders our component
// tree inside it.
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode is a development-only wrapper that helps catch common bugs
  // by intentionally double-rendering components (only in dev, not in production).
  <React.StrictMode>
    {/* BrowserRouter must wrap everything that uses routing */}
    <BrowserRouter>
      {/* AuthProvider must wrap everything that needs access to user/login/logout */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
