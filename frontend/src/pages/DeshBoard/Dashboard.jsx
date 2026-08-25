import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import './dashboard.css';

const Dashboard = () => {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploadFile, setUploadFile] = useState(null);
  const [isPublic, setIsPublic] = useState(false);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchFiles = async () => {

    try {

      const res = await API.get('/files/my-files');

      setFiles(res.data.files || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {

    e.preventDefault();

    setError('');

    if (!uploadFile) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();

    formData.append('file', uploadFile);
    formData.append('isPublic', isPublic);

    setUploading(true);
    setProgress(0);

    try {

      await API.post(
        '/files/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },

          onUploadProgress: (event) => {

            if (event.total) {

              const percent = Math.round(
                (event.loaded * 100) / event.total
              );

              setProgress(percent);

            }

          }
        }
      );

      setUploadFile(null);
      setIsPublic(false);
      setProgress(0);

      await fetchFiles();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Upload failed.'
      );

    } finally {

      setUploading(false);

    }
  };

  const handleToggle = async (id) => {

    try {

      await API.patch(`/files/${id}/toggle`);

      await fetchFiles();

    } catch (err) {

      console.error(err);

    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this file?'
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/files/${id}`);

      await fetchFiles();

    } catch (err) {

      console.error(err);

    }
  };

  const handleLogout = () => {

    localStorage.removeItem('token');

    navigate('/login');

  };

  const totalFiles = files.length;

  const publicFiles =
    files.filter(file => file.isPublic).length;

  const privateFiles =
    files.filter(file => !file.isPublic).length;

  const totalSize =
    files.reduce(
      (total, file) => total + (file.fileSize || 0),
      0
    );

  const formatSize = (bytes) => {

    if (!bytes) return '0 KB';

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (

    <div className="dashboard-page">

      {/* TOP BAR */}

      <header className="dashboard-header">

        <div>

          <span className="dashboard-eyebrow">
            YOUR VAULT
          </span>

          <h1>File Dashboard</h1>

          <p>
            Manage, upload and share your files securely.
          </p>

        </div>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>


      {/* STATS */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            ▦
          </div>

          <div>
            <span>Total files</span>
            <strong>{totalFiles}</strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            🔒
          </div>

          <div>
            <span>Private files</span>
            <strong>{privateFiles}</strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            ↗
          </div>

          <div>
            <span>Shared files</span>
            <strong>{publicFiles}</strong>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            ◉
          </div>

          <div>
            <span>Storage used</span>
            <strong>{formatSize(totalSize)}</strong>
          </div>

        </div>

      </section>


      {/* UPLOAD */}

      <section className="upload-card">

        <div className="upload-heading">

          <div>

            <span>FILE MANAGEMENT</span>

            <h2>Upload a new file</h2>

            <p>
              Maximum file size is 100MB.
            </p>

          </div>

          <div className="upload-symbol">
            ↑
          </div>

        </div>

        {error && (
          <div className="dashboard-error">
            <span>!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleUpload}>

          <label className="upload-zone">

            <input
              type="file"
              onChange={(e) =>
                setUploadFile(e.target.files[0])
              }
              disabled={uploading}
            />

            <div className="upload-zone-icon">
              ↑
            </div>

            <strong>
              {uploadFile
                ? uploadFile.name
                : 'Choose a file to upload'}
            </strong>

            <span>
              {uploadFile
                ? `${formatSize(uploadFile.size)} selected`
                : 'Click here or browse from your computer'}
            </span>

          </label>


          <div className="upload-options">

            <label className="public-toggle">

              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) =>
                  setIsPublic(e.target.checked)
                }
                disabled={uploading}
              />

              <span className="toggle-ui"></span>

              <div>

                <strong>
                  Make this file public
                </strong>

                <small>
                  Anyone with the link can access it.
                </small>

              </div>

            </label>

            <button
              className="upload-button"
              type="submit"
              disabled={uploading}
            >
              {uploading
                ? `Uploading ${progress}%`
                : 'Upload file →'}
            </button>

          </div>


          {uploading && (

            <div className="progress-wrapper">

              <div className="progress-info">

                <span>
                  Uploading file...
                </span>

                <strong>
                  {progress}%
                </strong>

              </div>

              <div className="progress-bar">
                <div
                  style={{
                    width: `${progress}%`
                  }}
                />
              </div>

            </div>

          )}

        </form>

      </section>


      {/* FILES */}

      <section className="files-section">

        <div className="files-heading">

          <div>
            <span>YOUR STORAGE</span>
            <h2>Recent files</h2>
          </div>

          <span className="file-count">
            {totalFiles} files
          </span>

        </div>


        {loading ? (

          <div className="empty-state">
            <div className="loading-spinner"></div>
            <p>Loading your files...</p>
          </div>

        ) : files.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              ▱
            </div>

            <h3>No files yet</h3>

            <p>
              Upload your first file to start using
              your secure vault.
            </p>

          </div>

        ) : (

          <div className="file-list">

            {files.map((file) => (

              <div
                className="file-row"
                key={file._id}
              >

                <div className="file-main">

                  <div className="file-icon">
                    📄
                  </div>

                  <div className="file-info">

                    <strong>
                      {file.fileName}
                    </strong>

                    <span>
                      {formatSize(file.fileSize)}
                    </span>

                  </div>

                </div>


                <div
                  className={
                    file.isPublic
                      ? 'access-badge public'
                      : 'access-badge private'
                  }
                >
                  <span></span>

                  {file.isPublic
                    ? 'Public'
                    : 'Private'}
                </div>


                <div className="file-actions">

                  {file.isPublic && (

                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="action-link"
                    >
                      Share
                    </a>

                  )}

                  <button
                    onClick={() =>
                      handleToggle(file._id)
                    }
                    className="action-button"
                  >
                    {file.isPublic
                      ? 'Make private'
                      : 'Make public'}
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(file._id)
                    }
                    className="delete-button"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default Dashboard;