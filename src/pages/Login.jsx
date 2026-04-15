// =============================================================================
// Login.jsx — THE LOGIN PAGE (form with email + password)
// =============================================================================
// This page shows a login form. When submitted, it calls the loginUser()
// API function. If credentials match, the user is logged in and redirected
// to the home page. If not, an error message is displayed.
//
// KEY CONCEPTS:
//   - Controlled inputs: each input's value is tied to a state variable
//     (e.g. value={email}), and onChange updates that state. This means
//     React "controls" the input — the state is the single source of truth.
//   - Form submission: onSubmit={handleSubmit} fires when the user clicks
//     the Login button or presses Enter. We call e.preventDefault() to stop
//     the browser from doing a traditional full-page form submission.
//   - async/await: handleSubmit is an async function because loginUser()
//     returns a Promise (it makes a network request).
//   - Error handling: try/catch wraps the API call. If it fails, we show
//     an error message using the "error" state variable.
// =============================================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api';

export default function Login() {
  // State for each form field + an error message string
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // login() from context — saves user data and triggers re-render in App.jsx
  const { login } = useAuth();

  // navigate() lets us redirect programmatically after successful login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    // Prevent the default browser behavior of reloading the page on form submit
    e.preventDefault();
    // Clear any previous error message
    setError('');

    try {
      // Call the API — returns the user object if found, or null if not
      const user = await loginUser(email, password);
      if (user) {
        // Save user to context + localStorage, then go to home page
        login(user);
        navigate('/');
      } else {
        setError('Invalid email or password.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    // Bootstrap grid: center the form card in a narrow column
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Login</h2>

            {/* Conditionally render the error alert only if there's an error */}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                {/* Controlled input: value comes from state, onChange updates state.
                    "required" is an HTML5 attribute — the browser won't submit
                    the form if this field is empty. */}
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>

            {/* Link to the register page for new users */}
            <p className="text-center mt-3 mb-0">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
