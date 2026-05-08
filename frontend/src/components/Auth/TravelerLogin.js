import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/apiService';
import { validateForm, validateField, checkPasswordStrength } from '../../utils/validation';
import '../../pages/AuthPage.css';
import '../../styles/auth-enhancements.css';

const TravelerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Real-time validation
    const validation = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: validation.isValid ? '' : validation.message
    }));
    
    // Password strength check
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate entire form
    const validation = validateForm(formData, ['email', 'password']);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
        role: 'traveler'
      };
      
      console.log('👤 Traveler Login data:', loginData);
      
      const response = await authService.login(loginData);
      
      if (response.success) {
        console.log('✅ Login successful:', response.user);
        setError('');
        setFieldErrors({});
        navigate('/home');
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
                placeholder="••••••••"
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
              />
              {fieldErrors.password && (
                <div className="invalid-feedback">
                  <i className="fas fa-exclamation-circle me-1"></i>
                  {fieldErrors.password}
                </div>
              )}
              {passwordStrength && (
                <div className="password-strength">
                  <small className="text-muted">قوة كلمة المرور:</small>
                  <div className="strength-meter">
                    <div 
                      className={`strength-bar strength-${passwordStrength.strength}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <small className={`strength-text strength-${passwordStrength.strength}`}>
                    {passwordStrength.message}
                  </small>
                  {passwordStrength.feedback.length > 0 && (
                    <div className="password-feedback">
                      <small>لتحسين:</small>
                      <ul>
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
