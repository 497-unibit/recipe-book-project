// =============================================================================
// Register.jsx — THE REGISTRATION PAGE (form with name + email + password)
// =============================================================================
// Almost identical to Login.jsx, but with an extra "name" field and
// client-side validation (password length check). After successful
// registration, the user is automatically logged in and redirected home.
//
// KEY CONCEPTS (same as Login, plus):
//   - Client-side validation: we check password.length before calling the API.
//     This gives instant feedback without a network request.
//   - The API itself also validates (checks for duplicate emails) and can
//     throw an error, which we catch and display.
// =============================================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation — check before making any API call
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return; // Stop here, don't call the API
    }

    try {
      // registerUser() will throw if email already exists (see api.js)
      const user = await registerUser({ name, email, password });
      // Auto-login after successful registration
      login(user);
      navigate('/');
    } catch (err) {
      // err.message contains the string from the thrown Error in api.js
      setError(err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
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
              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
            <p className="text-center mt-3 mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
