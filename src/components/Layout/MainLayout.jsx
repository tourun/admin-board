import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import Sidebar from './Sidebar'
import GlobalLoader from '../Loading/GlobalLoader'
import './MainLayout.css'

const MainLayout = () => {
    console.log("MainLayout rendering...")

    return (
        <div className="main-layout">
            <div className="main-layout__header">
                <div className="main-layout__logo">
                    <div className="main-layout__logo-text">
                        User Management
                    </div>
                </div>
                <div className="main-layout__user-info">
                    <span>Welcome, Administrator</span>
                </div>
            </div>

            {/* 主体内容区域 */}
            <div className="main-layout__body">
                <div className="main-layout__sidebar">
                    <Sidebar />
                </div>
                <div className="main-layout__content">
                    <div className="main-layout__outlet">
                        <Suspense fallback={<GlobalLoader message="Loading..." />}>
                            <Outlet />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainLayout