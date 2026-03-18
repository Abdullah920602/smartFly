import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import '../../pages/AuthPage.css';

const Register = () => {
  const [formData, setFormData] = useState({
    // بيانات مشتركة
    email: 'ahmad.jordan@example.com',
    password: '',
    confirmPassword: '',
    phone: '+962 7 1234 5678',
    // بيانات المستخدم العادي
    firstName: 'أحمد',
    lastName: 'محمد',
    dateOfBirth: '1990-01-15',
    nationality: 'jo'
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

  const fillExampleData = () => {
    setFormData({
      email: 'fatima.khalil@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      phone: '+962 7 9876 5432',
      firstName: 'فاطمة',
      lastName: 'خليل',
      dateOfBirth: '1992-05-20',
      nationality: 'jo'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      // هنا سيتم إضافة منطق التسجيل الحقيقي
      console.log('Traveler Register data:', { ...formData, userType: 'user' });
      
      // محاكاة التسجيل الناجح
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setError('فشل التسجيل. يرجى المحاولة مرة أخرى.');
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

          {/* زر ملء البيانات التوضيحية */}
          <div className="example-data-helper">
            <button 
              type="button" 
              className="example-btn" 
              onClick={fillExampleData}
            >
              <i className="fas fa-magic me-2"></i>
              ملء بيانات توضيحية
            </button>
            <p className="example-text">
              <i className="fas fa-info-circle me-1"></i>
              اضغط لملء النموذج ببيانات مثال لتسهيل التجربة
            </p>
          </div>

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
            <Link to="/login" className="auth-link">
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
