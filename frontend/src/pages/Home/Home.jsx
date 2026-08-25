import { Link } from 'react-router-dom';
import './home.css';
const Home = () => {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <span></span>
            Secure file storage
          </div>

          <h1>
            Your files.
            <br />
            <span>Your control.</span>
          </h1>

          <p className="hero-description">
            VaultBox gives you a secure place to upload, manage,
            and share your files. Keep everything private or share
            files instantly with a public link.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Create free account
              <span>→</span>
            </Link>

            <Link to="/login" className="btn-secondary">
              Sign in
            </Link>
          </div>

          <div className="hero-trust">
            <div>
              <strong>100MB</strong>
              <span>Max file size</span>
            </div>

            <div>
              <strong>Private</strong>
              <span>By default</span>
            </div>

            <div>
              <strong>Secure</strong>
              <span>Token protected</span>
            </div>
          </div>

        </div>

        {/* HERO PREVIEW */}
        <div className="hero-preview">

          <div className="preview-window">

            <div className="preview-top">
              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <span className="preview-title">
                VaultBox / Dashboard
              </span>
            </div>

            <div className="preview-body">

              <div className="preview-sidebar">

                <div className="preview-logo">
                  V
                </div>

                <div className="sidebar-item active">
                  ▦
                </div>

                <div className="sidebar-item">
                  □
                </div>

                <div className="sidebar-item">
                  ⚙
                </div>

              </div>

              <div className="preview-content">

                <div className="preview-heading">
                  <div>
                    <small>YOUR VAULT</small>
                    <h3>My Files</h3>
                  </div>

                  <button>+ Upload</button>
                </div>

                <div className="preview-stats">

                  <div>
                    <small>Total files</small>
                    <strong>24</strong>
                  </div>

                  <div>
                    <small>Private</small>
                    <strong>18</strong>
                  </div>

                  <div>
                    <small>Shared</small>
                    <strong>6</strong>
                  </div>

                </div>

                <div className="preview-file">
                  <span>📄</span>

                  <div>
                    <strong>project-report.pdf</strong>
                    <small>2.4 MB</small>
                  </div>

                  <em>PRIVATE</em>
                </div>

                <div className="preview-file">
                  <span>🖼️</span>

                  <div>
                    <strong>team-photo.jpg</strong>
                    <small>4.8 MB</small>
                  </div>

                  <em className="public">PUBLIC</em>
                </div>

                <div className="preview-file">
                  <span>📊</span>

                  <div>
                    <strong>financial-report.xlsx</strong>
                    <small>1.2 MB</small>
                  </div>

                  <em>PRIVATE</em>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="features-section">

        <div className="section-heading">
          <span>WHY VAULTBOX</span>
          <h2>Everything you need to manage files securely.</h2>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">↑</div>
            <span className="feature-number">01</span>

            <h3>Fast Uploads</h3>

            <p>
              Upload files up to 100MB with real-time
              upload progress and reliable API handling.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⌕</div>
            <span className="feature-number">02</span>

            <h3>Private by Default</h3>

            <p>
              Every uploaded file remains private until
              you explicitly decide to share it.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">↗</div>
            <span className="feature-number">03</span>

            <h3>Easy Sharing</h3>

            <p>
              Make a file public with one click and
              instantly provide a shareable URL.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="cta-section">

        <div>
          <span>READY WHEN YOU ARE</span>

          <h2>
            Start managing your files
            <br />
            with confidence.
          </h2>
        </div>

        <Link to="/register" className="cta-button">
          Create your vault →
        </Link>

      </section>

    </div>
  );
};

export default Home;