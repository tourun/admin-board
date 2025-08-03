import './GlobalLoader.css';

const GlobalLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="global-loader">
      <div className="global-loader-content">
        <div className="global-loader-spinner">
          <div className="spinner"></div>
        </div>
        <p className="global-loader-message">{message}</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
