import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../reducers/userReducer';
import { canAccessManagement, formatUserRole } from '../utils/permissions';
import './Navigation.css';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(state => state.user.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  if (!currentUser) return null;

  const navItems = [
    { path: '/blogs', label: 'Blogs', icon: '📝' },
    { path: '/create', label: 'Create Blog', icon: '✍️' },
    { path: '/users', label: 'Users', icon: '👥' }
  ];

  if (canAccessManagement(currentUser)) {
    navItems.push({ path: '/management', label: 'Management', icon: '🔧' });
  }

  // 检查当前路径是否匹配
  const isActive = (path) => {
    if (path === '/blogs') {
      return location.pathname === '/' || location.pathname === '/blogs' || location.pathname.startsWith('/blogs/');
    }
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo and Brand */}
        <div className="nav-brand">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2>🔗 BlogHub</h2>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Desktop User Info and Logout */}
        <div className="desktop-user">
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">{formatUserRole(currentUser)}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-menu-btn"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Menu Dropdown */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {/* User Info */}
            <div className="mobile-user-info">
              <div className="mobile-user-name">{currentUser.name}</div>
              <div className="mobile-user-role">{formatUserRole(currentUser)}</div>
            </div>

            {/* Navigation Items */}
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Logout Button */}
            <button onClick={handleLogout} className="mobile-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
