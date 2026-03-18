import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../pages/AuthPage.css';

const TravelerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // هنا سيتم إضافة منطق المصادقة الحقيقي
      console.log('Traveler Login data:', formData);
      
      // محاكاة تسجيل الدخول الناجح
      setTimeout(() => {
        const userData = {
          name: 'مسافر',
          email: formData.email,
          type: 'user'
        };
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        navigate('/home');
      }, 1000);
    } catch (error) {
      setError('فشل تسجيل الدخول. يرجى التحقق من بياناتك.');
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
        <div className="auth-card">
          <div className="auth-header">
            <h2>
              <i className="fas fa-user me-2"></i>
              تسجيل دخول المسافرين
            </h2>
            <p className="auth-subtitle">
              SmartFly Jordan - منصة حجز الطيران الأردني الذكية
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
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
              />
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
              className="auth-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ليس لديك حساب؟{' '}
              <Link to="/auth" className="auth-link">
                سجل الآن
              </Link>
            </p>
            <p>
              <Link to="/auth" className="auth-link">
                <i className="fas fa-arrow-right me-2"></i>
                العودة للصفحة الرئيسية
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerLogin;
