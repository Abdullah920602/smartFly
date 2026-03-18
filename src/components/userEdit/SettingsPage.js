import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  
  // User settings state
  const [userSettings, setUserSettings] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'الأردن',
    preferredLanguage: 'العربية'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Check for theme preference
    const savedTheme = localStorage.getItem('theme');
    const isLightMode = savedTheme === 'light';
    setIsDarkMode(!isLightMode);

    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData) {
      setUserSettings(prev => ({
        ...prev,
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        country: userData.country || 'الأردن'
      }));
    }

    // Load settings from localStorage
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    if (Object.keys(settings).length > 0) {
      setUserSettings(prev => ({ ...prev, ...settings }));
    }

    // Listen for theme changes
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem('theme');
      setIsDarkMode(currentTheme !== 'light');
    };

    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      setMessage('');
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      
      // Update user data
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedUserData = {
        ...userData,
        fullName: userSettings.fullName,
        email: userSettings.email,
        phone: userSettings.phone,
        address: userSettings.address,
        city: userSettings.city,
        country: userSettings.country
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      setMessage('تم حفظ الإعدادات بنجاح');
      setMessageType('success');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
      
    } catch (error) {
      setMessage('حدث خطأ أثناء حفظ الإعدادات');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    try {
      setIsLoading(true);
      setMessage('');
      
      // Validate passwords
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setMessage('يرجى ملء جميع حقول كلمة المرور');
        setMessageType('error');
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage('كلمة المرور الجديدة غير متطابقة');
        setMessageType('error');
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        setMessageType('error');
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would make API call to change password
      setMessage('تم تغيير كلمة المرور بنجاح');
      setMessageType('success');
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
      
    } catch (error) {
      setMessage('حدث خطأ أثناء تغيير كلمة المرور');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userSettings');
    localStorage.removeItem('theme');
    navigate('/auth');
  };

  const deleteAccount = async () => {
    if (window.confirm('هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real app, this would make API call to delete account
        localStorage.removeItem('userData');
        localStorage.removeItem('userSettings');
        localStorage.removeItem('theme');
        
        navigate('/auth');
      } catch (error) {
        setMessage('حدث خطأ أثناء حذف الحساب');
        setMessageType('error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const tabs = [
    {
      id: 'personal',
      label: 'المعلومات الشخصية',
      icon: 'fa-user',
      color: '#3b82f6'
    },
    {
      id: 'password',
      label: 'كلمة المرور',
      icon: 'fa-lock',
      color: '#ef4444'
    }
  ];

  return (
    <div className={`settings-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-cog"></i>
            </div>
            <div className="header-text">
              <h1>الإعدادات</h1>
              <p>إدارة حسابك وتفضيلاتك</p>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <div className="tabs-container">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ '--tab-color': tab.color }}
                >
                  <i className={`fas ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="tab-indicator"></div>
                  )}
                </button>
              ))}
            </div>

            {/* User Info Card */}
            <div className="user-info-card">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="user-details">
                <h3>{userSettings.fullName || 'مستخدم SmartFly'}</h3>
                <p>{userSettings.email || 'user@smartfly.jo'}</p>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="settings-main">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>
                  <i className="fas fa-user"></i>
                  المعلومات الشخصية
                </h2>
                <p>تحديث معلوماتك الشخصية وبيانات الاتصال</p>
              </div>

              <div className="settings-grid">
                <div className="form-section">
                  <h3>المعلومات الأساسية</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>الاسم الكامل</label>
                      <input
                        type="text"
                        name="fullName"
                        value={userSettings.fullName}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div className="form-group">
                      <label>البريد الإلكتروني</label>
                      <input
                        type="email"
                        name="email"
                        value={userSettings.email}
                        onChange={handleInputChange}
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    </div>
                    <div className="form-group">
                      <label>رقم الهاتف</label>
                      <input
                        type="tel"
                        name="phone"
                        value={userSettings.phone}
                        onChange={handleInputChange}
                        placeholder="أدخل رقم هاتفك"
                      />
                    </div>
                    <div className="form-group">
                      <label>اللغة المفضلة</label>
                      <select
                        name="preferredLanguage"
                        value={userSettings.preferredLanguage}
                        onChange={handleInputChange}
                      >
                        <option value="العربية">العربية</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>معلومات الموقع</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>العنوان</label>
                      <input
                        type="text"
                        name="address"
                        value={userSettings.address}
                        onChange={handleInputChange}
                        placeholder="أدخل عنوانك"
                      />
                    </div>
                    <div className="form-group">
                      <label>المدينة</label>
                      <input
                        type="text"
                        name="city"
                        value={userSettings.city}
                        onChange={handleInputChange}
                        placeholder="أدخل مدينتك"
                      />
                    </div>
                    <div className="form-group">
                      <label>البلد</label>
                      <select
                        name="country"
                        value={userSettings.country}
                        onChange={handleInputChange}
                      >
                        <option value="الأردن">الأردن</option>
                        <option value="السعودية">السعودية</option>
                        <option value="الإمارات">الإمارات</option>
                        <option value="قطر">قطر</option>
                        <option value="الكويت">الكويت</option>
                        <option value="مصر">مصر</option>
                        <option value="لبنان">لبنان</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>
                  <i className="fas fa-lock"></i>
                  كلمة المرور
                </h2>
                <p>تغيير كلمة المرور الخاصة بك</p>
              </div>

              <div className="settings-grid">
                <div className="form-section">
                  <h3>تغيير كلمة المرور</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>كلمة المرور الحالية</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="أدخل كلمة المرور الحالية"
                      />
                    </div>
                    <div className="form-group">
                      <label>كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="أدخل كلمة المرور الجديدة"
                      />
                    </div>
                    <div className="form-group">
                      <label>تأكيد كلمة المرور</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                      />
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={changePassword}
                    disabled={isLoading}
                  >
                    <i className="fas fa-key"></i>
                    {isLoading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="settings-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={saveSettings}
              disabled={isLoading}
            >
              <i className="fas fa-save"></i>
              {isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
            
            <div className="danger-actions">
              <button 
                className="btn btn-outline"
                onClick={logout}
              >
                <i className="fas fa-sign-out-alt"></i>
                تسجيل الخروج
              </button>
              
              <button 
                className="btn btn-danger"
                onClick={deleteAccount}
                disabled={isLoading}
              >
                <i className="fas fa-trash"></i>
                {isLoading ? 'جاري الحذف...' : 'حذف الحساب'}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
