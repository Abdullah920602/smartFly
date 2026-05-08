import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/apiService';
import { registerAirline, validateAirlineForm } from '../../utils/registerFunctions';
import './Auth.css';
import '../../pages/AuthPage.css';
import '../../styles/auth-enhancements.css';

const AirlineRegister = () => {
  const [formData, setFormData] = useState({
    // بيانات شركة الطيران
    companyName: '',
    companyCode: '',
    licenseNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // معالجة خاصة لكود شركة الطيران
    const processedValue = name === 'companyCode' ? value.toUpperCase() : value;
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // التحقق من النموذج
    const validation = validateAirlineForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const response = await registerAirline(formData, authService);
      
      if (response.success) {
        console.log('✅ Registration successful:', response.user);
        setError('');
        setFieldErrors({});
        setSuccess('تم إنشاء حساب شركة الطيران بنجاح! جاري التحويل إلى لوحة التحكم...');
        setTimeout(() => {
          navigate('/airline-dashboard');
        }, 2000);
      } else {
        console.error('❌ Registration failed:', response.message);
        setError(response.message || 'فشل تسجيل الشركة');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError(error.response?.data?.message || 'فشل التسجيل. يرجى التحقق من بياناتك.');
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
                <i className="fas fa-building me-2"></i>
                SmartFly Jordan
              </h2>
              <p className="auth-subtitle">تسجيل شركة طيران جديدة</p>
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
            <label htmlFor="companyName">
              <i className="fas fa-building me-2"></i>
              اسم الشركة
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              placeholder="مثل: الخطوط الجوية الملكية الأردنية"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyCode">
                <i className="fas fa-code me-2"></i>
                كود الشركة (IATA)
              </label>
              <input
                type="text"
                id="companyCode"
                name="companyCode"
                value={formData.companyCode}
                onChange={handleInputChange}
                required
                placeholder="مثل: RJ"
                maxLength="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="licenseNumber">
                <i className="fas fa-certificate me-2"></i>
                رقم الرخصة
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
                placeholder="مثل: CAAN-2024-001"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contactPerson">
              <i className="fas fa-user-tie me-2"></i>
              شخص الاتصال
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              required
              placeholder="مثل: أحمد خالد - مدير العمليات"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope me-2"></i>
              البريد الإلكتروني للشركة
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="مثل: info@airline.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <i className="fas fa-phone me-2"></i>
              رقم هاتف الشركة
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="مثل: +962 6 5000 1111"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">
              <i className="fas fa-globe me-2"></i>
              الموقع الإلكتروني
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="مثل: https://www.airline.com"
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
                    إنشاء حساب شركة
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="auth-link">
                  سجل دخول
                </Link>
              </p>
              <p>
                <Link to="/register" className="auth-link">
                  <i className="fas fa-user me-2"></i>
                  تسجيل كمسافر
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirlineRegister;
