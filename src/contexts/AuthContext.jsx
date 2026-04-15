// =============================================================================
// AuthContext.jsx — GLOBAL AUTHENTICATION STATE (React Context + Custom Hook)
// =============================================================================
// PROBLEM THIS SOLVES:
//   Many components need to know "who is logged in?" — the Navbar, the App
//   router, the RecipeForm, etc. Passing this data through props from parent
//   to child to grandchild ("prop drilling") would be messy.
//
// SOLUTION — REACT CONTEXT:
//   Context lets you create a "global variable" for a subtree of components.
//   Any component inside the <AuthProvider> can call useAuth() and instantly
//   get { user, login, logout } — no props needed.
//
// HOW IT WORKS STEP BY STEP:
//   1. createContext(null) creates a Context object with a default value of null.
//   2. <AuthContext.Provider value={...}> makes that value available to all
//      child components.
//   3. useContext(AuthContext) (wrapped in our useAuth hook) reads that value
//      from the nearest Provider above in the tree.
//
// PERSISTENCE WITH localStorage:
//   When the user refreshes the page, all React state is lost. To keep
//   them logged in, we save the user object to localStorage (which persists
//   across page reloads). On app startup, we read it back.
// =============================================================================

import { createContext, useState, useContext } from 'react';

// Step 1: Create the context. The "null" is the default value used only if
// a component tries to use this context without a Provider above it.
const AuthContext = createContext(null);

// Step 2: The Provider component. This wraps the entire app in main.jsx.
// "children" is a special React prop — it represents whatever JSX is
// placed inside <AuthProvider>...</AuthProvider>.
export function AuthProvider({ children }) {
  // useState with an initializer function (lazy initialization):
  // Instead of useState(null), we pass a function () => { ... }.
  // React calls this function ONCE on the very first render to compute
  // the initial value. Here we check localStorage for a saved user.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    // If there's saved data, parse the JSON string back into an object.
    // If not, start with null (meaning "not logged in").
    return saved ? JSON.parse(saved) : null;
  });

  // login() is called after a successful API login or register.
  // It saves the user to localStorage AND updates React state (which
  // triggers a re-render across the entire app).
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // logout() clears everything — removes from localStorage and sets
  // state to null, which causes App.jsx to switch to the guest view.
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // The "value" prop is what every useAuth() call will receive.
  // Any component can destructure { user, login, logout } from it.
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: Custom hook — a convenient shortcut so components don't have
// to import both useContext and AuthContext. They just import useAuth.
//
// USAGE IN ANY COMPONENT:
//   const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
