import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainNavbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (mock implementation)
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{
      background: 'var(--primary-navy)',
      boxShadow: 'var(--soft-shadow)',
      borderBottom: '1px solid rgba(245, 158, 11, 0.2)'
    }}>
      <div className="container">

        {/* شعار الموقع */}
        <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: '1.5rem', color: 'var(--jordan-white)' }}>
          <i className="fas fa-plane me-2" style={{ color: 'var(--accent-gold)' }}></i>
          SmartFly Jordan
        </Link>

        {/* زر فتح/إغلاق القائمة في الموبايل */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* روابط القائمة */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home" style={{ transition: 'var(--smooth-transition)' }}>
                <i className="fas fa-home me-1"></i> الرئيسية
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/flights" style={{ transition: 'var(--smooth-transition)' }}>
                <i className="fas fa-plane-departure me-1"></i> الرحلات
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/airlines" style={{ transition: 'var(--smooth-transition)' }}>
                <i className="fas fa-building me-1"></i> شركات الطيران
              </Link>
            </li>
       
            <li className="nav-item">
              <Link className="nav-link" to="/data-manager" style={{ transition: 'var(--smooth-transition)' }}>
                <i className="fas fa-database me-1"></i> إدارة البيانات
              </Link>
            </li>
            
            {/* User circle and logout */}
            {user ? (
              <li className="nav-item dropdown">
                <div 
                  className="user-section dropdown-toggle"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="user-circle">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                  </div>
                </div>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                  <li>
                    <Link className="dropdown-item" to="/airline-dashboard">
                      <i className="fas fa-tachometer-alt me-1"></i> داش بورد
                    </Link>
                  </li>
         
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="fas fa-cog me-1"></i> الإعدادات
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-1"></i> تسجيل خروج
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/auth" style={{ transition: 'var(--smooth-transition)' }}>
                  <i className="fas fa-sign-in-alt me-1"></i> تسجيل دخول
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
