import './GlobalLoader.css';

const GlobalLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="global-loader">
            <div className="global-loader__content">
                <div className="global-loader__spinner">
                    <div className="spinner"></div>
                </div>
                <p className="global-loader__message">{message}</p>
            </div>
        </div>
    );
};

export default GlobalLoader;