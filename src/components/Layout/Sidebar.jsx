import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
    const navigationItems = [
        {
            path: '/users',
            label: 'User',
            icon: '👤'
        },
        {
            path: '/roles',
            label: 'Role',
            icon: '🔐'
        }
    ]

    return (
        <nav className="sidebar">
            <div className="sidebar__header">
                <h2 className="sidebar__title">Admin System</h2>
            </div>
            <ul className="sidebar__menu">
                {navigationItems.map((item) => (
                    <li key={item.path} className="sidebar__menu-item">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar__menu-link ${isActive ? 'sidebar__menu-link--active' : ''}`
                            }
                        >
                            <span className="sidebar__menu-icon">{item.icon}</span>
                            <span className="sidebar__menu-text">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Sidebar