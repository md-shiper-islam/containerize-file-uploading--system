import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        <Link to="/" className="brand">
          <span className="brand-icon">V</span>
          <span>VaultBox</span>
        </Link>

        <nav className="nav-links">

          {!token && (
            <>
              <Link
                to="/"
                className={location.pathname === '/' ? 'nav-active' : ''}
              >
                Home
              </Link>

              <Link
                to="/login"
                className={location.pathname === '/login' ? 'nav-active' : ''}
              >
                Sign in
              </Link>

              <Link to="/register" className="nav-register">
                Get Started
              </Link>
            </>
          )}

          {token && (
            <>
              <Link
                to="/dashboard"
                className={
                  location.pathname === '/dashboard'
                    ? 'nav-active'
                    : ''
                }
              >
                Dashboard
              </Link>

              <button
                className="nav-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Navbar;