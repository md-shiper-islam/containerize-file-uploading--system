import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import './register.css';

const Register = () => {

  const [formData, setFormData] = useState({
    name: '',
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

      const res = await API.post('/auth/register', formData);

      localStorage.setItem('token', res.data.token);

      navigate('/dashboard');

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Registration failed'
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
              ✦
            </div>

            <h1>Create your vault</h1>

            <p>
              Secure your files in less than a minute.
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

              <label>Full name</label>

              <input
                className="field-input"
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

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

              <label>Password</label>

              <input
                className="field-input"
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />

              <small className="field-hint">
                Use at least 6 characters.
              </small>

            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          <div className="auth-divider">
            <span>ALREADY A MEMBER?</span>
          </div>

          <p className="auth-switch">

            Already have an account?

            <Link to="/login">
              Sign in
            </Link>

          </p>

        </div>

        <p className="auth-footer">
          Protected access · Secure file management
        </p>

      </div>

    </div>
  );
};

export default Register;