import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import './MainLayout.css'

const MainLayout = () => {
    return (
        <div className="main-layout">
            <div className="main-layout__sidebar">
                <Sidebar />
            </div>
            <div className="main-layout__content">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout