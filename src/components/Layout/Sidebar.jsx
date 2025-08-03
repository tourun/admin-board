import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigationItems = [
    {
      path: '/users',
      label: 'User',
    },
    {
      path: '/roles',
      label: 'Role',
    },
  ];

  return (
    <nav className="sidebar">
      <ul className="sidebar-menu">
        {navigationItems.map((item) => (
          <li key={item.path} className="sidebar-menu-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `sidebar-menu-link ${isActive ? 'sidebar-menu-link--active' : ''}`
              }
            >
              <span className="sidebar-menu-text">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
