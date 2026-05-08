import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/apiService';
import { registerTraveler, validateTravelerForm } from '../../utils/registerFunctions';
import './Auth.css';
import '../../pages/AuthPage.css';
import '../../styles/auth-enhancements.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: 'jo'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Real-time validation
    const validation = validateTravelerForm(formData);
    if (validation.errors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: validation.errors[name]
      }));
    } else {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate entire form
    const validation = validateTravelerForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const response = await registerTraveler(formData, authService);
      
      if (response.success) {
        console.log('✅ Registration successful:', response.user);
        setError('');
        setFieldErrors({});
        setSuccess('تم إنشاء الحساب بنجاح! جاري التحويل إلى الصفحة الرئيسية...');
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        console.error('❌ Registration failed:', response.message);
        setError(response.message || 'فشل التسجيل');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError(error.response?.data?.message || 'فشل التسجيل. يرجى المحاولة مرة أخرى.');
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
                <i className="fas fa-user me-2"></i>
                SmartFly Jordan
              </h2>
              <p className="auth-subtitle">تسجيل مسافر جديد</p>
            </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </div>
          )}


          {/* نموذج متدفق بدون أقسام */}
          <div className="form-group">
            <label htmlFor="firstName">
              <i className="fas fa-user me-2"></i>
              الاسم الكامل
            </label>
            <div className="form-row">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="مثل: أحمد"
              />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="مثل: محمد"
              />
            </div>
          </div>

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
              placeholder="مثل: user@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <i className="fas fa-phone me-2"></i>
              رقم الهاتف
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="مثل: +962 7 1234 5678"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">
                <i className="fas fa-calendar me-2"></i>
                تاريخ الميلاد
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nationality">
                <i className="fas fa-flag me-2"></i>
                الجنسية
              </label>
              <select
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                required
              >
                <option value="">اختر الجنسية</option>
                <option value="jo">أردني</option>
                <option value="sa">سعودي</option>
                <option value="ae">إماراتي</option>
                <option value="qa">قطري</option>
                <option value="bh">بحريني</option>
                <option value="kw">كويتي</option>
                <option value="om">عماني</option>
                <option value="eg">مصري</option>
                <option value="other">أخرى</option>
              </select>
            </div>
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
              placeholder="اختر كلمة مرور قوية (8+ أحرف)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock me-2"></i>
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="أعد كتابة كلمة المرور"
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                جاري إنشاء الحساب...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus me-2"></i>
                إنشاء حساب
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            لديك حساب بالفعل؟{' '}
            <Link to="/" className="auth-link">
              سجل دخول
            </Link>
          </p>
          <p>
            <Link to="/airline-register" className="auth-link">
              <i className="fas fa-building me-2"></i>
              تسجيل شركة طيران
            </Link>
          </p>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
