import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import './login.css';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      const res = await API.post('/auth/login', formData);

      localStorage.setItem('token', res.data.token);

      navigate('/dashboard');

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Invalid email or password'
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-wrapper">

        <div className="auth-brand">
          <span>V</span>
          VaultBox
        </div>

        <div className="auth-card">

          <div className="auth-card-header">

            <div className="auth-icon">
              🔐
            </div>

            <h1>Welcome back</h1>

            <p>
              Sign in to access your secure vault.
            </p>

          </div>

          {error && (
            <div className="auth-error">
              <span>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="field-group">

              <label>Email address</label>

              <input
                className="field-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="field-group">

              <div className="field-label-row">
                <label>Password</label>
                <span>Secure login</span>
              </div>

              <input
                className="field-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="auth-divider">
            <span>NEW TO VAULTBOX?</span>
          </div>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/register">
              Create an account
            </Link>
          </p>

        </div>

        <p className="auth-footer">
          Your files. Your privacy. Your control.
        </p>

      </div>

    </div>
  );
};

export default Login;