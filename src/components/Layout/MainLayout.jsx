import { Outlet, useNavigation } from 'react-router-dom';
import Sidebar from './Sidebar';
import LoadingSpinner from '../Common/LoadingSpinner';
import './MainLayout.css';

const MainLayout = () => {
  console.log('MainLayout rendering...');

  const navigation = useNavigation();

  return (
    <div className="main-layout">
      <div className="main-layout-header">
        <div className="main-layout-logo">
          <div className="main-layout-logo-text">
            <span className="main-layout-logo-accent">
              Entitlement Management
            </span>
          </div>
        </div>
        <div className="main-layout-user-info">
          <span>Welcome, Administrator</span>
        </div>
      </div>

      {/* 主体内容区域 */}
      <div className="main-layout-body">
        <div className="main-layout-sidebar">
          <Sidebar />
        </div>
        <div className="main-layout-content">
          <div
            id="detail"
            className={`main-layout-outlet ${navigation.state === 'loading' ? 'loading' : ''}`}
          >
            <Outlet />
            {navigation.state === 'loading' && (
              <LoadingSpinner
                size="large"
                message="Loading page..."
                overlay={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
