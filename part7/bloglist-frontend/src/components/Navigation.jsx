import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../reducers/userReducer';
import { canAccessManagement, formatUserRole } from '../utils/permissions';
import './Navigation.css';

const Navigation = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    setActiveTab('blogs');
    setIsMobileMenuOpen(false);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  if (!currentUser) return null;

  const navItems = [
    { id: 'blogs', label: 'Blogs', icon: '📝' },
    { id: 'users', label: 'Users', icon: '👥' }
  ];

  if (canAccessManagement(currentUser)) {
    navItems.push({ id: 'management', label: 'Management', icon: '🔧' });
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo and Brand */}
        <div className="nav-brand">
          <h2>🔗 BlogHub</h2>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
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
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
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
