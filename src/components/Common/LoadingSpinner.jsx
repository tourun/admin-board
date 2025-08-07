import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'medium',
  message = 'Loading...',
  overlay = false,
  inline = false,
}) => {
  const spinnerClass = `loading-spinner ${size} ${overlay ? 'overlay' : ''} ${inline ? 'inline' : ''}`;

  return (
    <div className={spinnerClass}>
      <div className="loading-spinner-content">
        <div className="loading-spinner-icon">
          <div className="spinner"></div>
        </div>
        {message && <p className="loading-spinner-message">{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
