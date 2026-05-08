import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Login, Register, TravelerLogin } from '../components/Auth';
import './AuthPage.css';


const AuthPage = ({ forceRegister = false }) => {
  const [isLogin, setIsLogin] = useState(!forceRegister);

  useEffect(() => {
    if (forceRegister) {
      setIsLogin(false);
    }
  }, [forceRegister]);

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="floating-elements">
          <div className="plane plane-1">✈️</div>
          <div className="plane plane-2">✈️</div>
          <div className="plane plane-3">✈️</div>
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">☁️</div>
          <div className="cloud cloud-3">☁️</div>
        </div>
      </div>
      
      <div className="auth-content">
        <div className="auth-switcher">
          <button
            className={`switch-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            <i className="fas fa-sign-in-alt me-2"></i>
            تسجيل الدخول
          </button>
          <button
            className={`switch-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            <i className="fas fa-user-plus me-2"></i>
            إنشاء حساب
          </button>
        </div>

        {/* Quick login options */}
        <div className="quick-login-options">
          <p className="quick-login-title">تسجيل دخول سريع:</p>
          <div className="quick-login-buttons">
            <Link to="/traveler-login" className="quick-login-btn traveler">
              <i className="fas fa-user me-2"></i>
              تسجيل دخول المسافرين
            </Link>
          </div>
        </div>

        <div className="auth-form-container">
          {isLogin && !forceRegister ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
