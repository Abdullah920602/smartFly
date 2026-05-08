import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * مكون النافبار الجانبي - يحتوي على التنقل السريع وإضافة الرحلات
 * @param {boolean} sidebarOpen - حالة فتح/إغلاق النافبار
 * @param {function} toggleSidebar - دالة تبديل حالة النافبار
 */
const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  // حالة شركة الطيران المختارة
  const [selectedAirline, setSelectedAirline] = useState('');
  
  // حالة نموذج إضافة الرحلة السريعة
  const [flightForm, setFlightForm] = useState({
    flightNumber: '',
    departure: '',
    arrival: '',
    date: '',
    time: '',
    price: ''
  });

  // قائمة شركات الطيران الأردنية
  const airlines = [
    { id: 1, name: 'Royal Jordanian', code: 'RJ' },
    { id: 2, name: 'Jordan Aviation', code: 'R5' },
    { id: 3, name: 'Arab Wings', code: 'AW' },
    { id: 4, name: 'Jazeera Airways Jordan', code: 'JY' }
  ];

  /**
   * دالة معالجة إرسال نموذج إضافة الرحلة
   * @param {Event} e - حدث الإرسال
   */
  const handleFlightSubmit = (e) => {
    e.preventDefault();
    console.log('Flight Data:', { ...flightForm, airline: selectedAirline });
    // يمكن إضافة منطق حفظ البيانات هنا
    alert('Flight added successfully!');
    // إعادة تعيين النموذج بعد الحفظ
    setFlightForm({
      flightNumber: '',
      departure: '',
      arrival: '',
      date: '',
      time: '',
      price: ''
    });
    setSelectedAirline('');
  };

  /**
   * دالة معالجة تغيير قيم حقول النموذج
   * @param {Event} e - حدث التغيير
   */
  const handleInputChange = (e) => {
    setFlightForm({
      ...flightForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* طبقة تغطية للموبايل - تظهر خلف النافبار وتغلقه عند النقر */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay d-lg-none" 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        ></div>
      )}
      
      <div className={`sidebar bg-light border-end ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} 
           style={{ 
             width: '300px', 
             minHeight: '100vh',
             transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
             transition: 'transform 0.3s ease'
           }}>
        <div className="p-3">
          {/* رأس النافبار مع زر الإغلاق للموبايل */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="text-primary mb-0">
              <i className="fas fa-cog me-2"></i>
              Quick Actions
            </h5>
            {/* زر الإغلاق - يظهر فقط في الموبايل */}
            <button 
              className="btn btn-sm btn-outline-secondary d-lg-none"
              onClick={toggleSidebar}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* روابط التنقل الرئيسية */}
          <div className="mb-4">
            <h6 className="text-primary mb-3">
              <i className="fas fa-compass me-2"></i>
              Navigation
            </h6>
            {/* قائمة الصفحات الرئيسية */}
            <div className="list-group">
               <Link to="/" className="list-group-item list-group-item-action" onClick={toggleSidebar}>
                 <i className="fas fa-home me-2"></i>
                 الرئيسية
               </Link>
               <Link to="/flights" className="list-group-item list-group-item-action" onClick={toggleSidebar}>
                 <i className="fas fa-plane-departure me-2"></i>
                 الرحلات
               </Link>
               <Link to="/airlines" className="list-group-item list-group-item-action" onClick={toggleSidebar}>
                 <i className="fas fa-building me-2"></i>
                 شركات الطيران
               </Link>
               <Link to="/create-flight" className="list-group-item list-group-item-action" onClick={toggleSidebar}>
                 <i className="fas fa-plus me-2"></i>
                 إضافة رحلة
               </Link>
               <Link to="/data-manager" className="list-group-item list-group-item-action" onClick={toggleSidebar}>
                 <i className="fas fa-database me-2"></i>
                 إدارة البيانات
               </Link>
               <Link to="/smart-chat" className="list-group-item list-group-item-action" onClick={toggleSidebar}>
                 <i className="fas fa-robot me-2"></i>
                 المساعد الذكي
               </Link>
             </div>
          </div>

          {/* قسم شركات الطيران الأردنية */}
          <div className="mb-4">
            <h6 className="text-primary mb-3">
              <i className="fas fa-building me-2"></i>
              شركات الطيران الأردنية
            </h6>
            {/* قائمة شركات الطيران مع إمكانية الاختيار */}
            <div className="list-group">
              {airlines.map(airline => (
                <button
                  key={airline.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                    selectedAirline === airline.name ? 'active' : ''
                  }`}
                  onClick={() => setSelectedAirline(airline.name)}
                >
                  <span>{airline.name}</span>
                  {/* رمز الشركة */}
                  <span className="badge bg-secondary rounded-pill">{airline.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* نموذج إضافة رحلة سريعة */}
          <div className="mb-4">
            <h6 className="text-success mb-3">
              <i className="fas fa-plus me-2"></i>
              إضافة رحلة سريعة
            </h6>
            {/* نموذج إدخال بيانات الرحلة */}
            <form action={'https//:....'} onSubmit={handleFlightSubmit}>
              <div className="mb-3">
                <label className="form-label small">رقم الرحلة</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="flightNumber"
                  value={flightForm.flightNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label small">مدينة الإقلاع</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="departure"
                  value={flightForm.departure}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label small">مدينة الوصول</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="arrival"
                  value={flightForm.arrival}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label small">التاريخ</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  name="date"
                  value={flightForm.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label small">الوقت</label>
                <input
                  type="time"
                  className="form-control form-control-sm"
                  name="time"
                  value={flightForm.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label small">السعر</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  name="price"
                  value={flightForm.price}
                  onChange={handleInputChange}
                  placeholder="In USD"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label small">شركة الطيران</label>
                <select
                  className="form-select form-select-sm"
                  value={selectedAirline}
                  onChange={(e) => setSelectedAirline(e.target.value)}
                  required
                >
                  <option value="">اختر الشركة</option>
                  {airlines.map(airline => (
                    <option key={airline.id} value={airline.name}>
                      {airline.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="btn btn-success btn-sm w-100">
                <i className="fas fa-save me-2"></i>
                حفظ الرحلة
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 