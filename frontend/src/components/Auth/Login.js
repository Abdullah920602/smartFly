import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/apiService';
import { loginUser } from '../../utils/registerFunctions';
import './Auth.css';
import '../../pages/AuthPage.css';
import '../../styles/auth-enhancements.css';

const Login = () => {
  const [isUserType, setIsUserType] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
        role: isUserType ? 'traveler' : 'airline'
      };
      
      const response = await loginUser(formData, authService);
      
      if (response.success) {
        setError('');
        navigate(response.redirectTo);
      } else {
        setError(response.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.response?.data?.message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="auth-form-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>
                <i className="fas fa-plane me-2"></i>
                SmartFly Jordan
              </h2>
              <p className="auth-subtitle">
                {isUserType ? 'تسجيل دخول المسافرين' : 'تسجيل دخول شركات الطيران'}
              </p>
            </div>

            {/* أزرار تبديل نوع المستخدم */}
            <div className="user-type-toggle">
              <button
                className={`toggle-btn ${isUserType ? 'active' : ''}`}
                onClick={() => setIsUserType(true)}
              >
                <i className="fas fa-user me-2"></i>
                مسافر
              </button>
              <button
                className={`toggle-btn ${!isUserType ? 'active' : ''}`}
                onClick={() => setIsUserType(false)}
              >
                <i className="fas fa-building me-2"></i>
                شركة طيران
              </button>
            </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              <i className="fas fa-envelope me-2"></i>
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="example@email.com"
              className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
            />
            {fieldErrors.email && (
              <div className="invalid-feedback">
                <i className="fas fa-exclamation-circle me-1"></i>
                {fieldErrors.email}
              </div>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              <i className="fas fa-lock me-2"></i>
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="أدخل كلمة المرور"
              className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
            />
            {fieldErrors.password && (
              <div className="invalid-feedback">
                <i className="fas fa-exclamation-circle me-1"></i>
                {fieldErrors.password}
              </div>
            )}
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">تذكرني</label>
            </div>
            <Link to="#" className="forgot-password">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                جاري المعالجة...
              </>
            ) : (
              <>
                <i className={`fas fa-${isUserType ? 'user' : 'building'} me-2`}></i>
                {isUserType ? 'تسجيل دخول مسافر' : 'تسجيل دخول شركة'}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ليس لديك حساب؟{' '}
            <Link to="/register" className="auth-link">
              سجل الآن
            </Link>
          </p>
        </div>

        {/* نافذة تسريع لإنشاء الحسابات */}
        <div className="quick-nav-section">
          <h4>إنشاء حساب جديد</h4>
          <div className="quick-nav-buttons">
            <Link to="/register" className="quick-nav-btn traveler-btn">
              <i className="fas fa-user me-2"></i>
              حساب مسافر
            </Link>
            <Link to="/airline-register" className="quick-nav-btn airline-btn">
              <i className="fas fa-building me-2"></i>
              حساب شركة طيران
            </Link>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
