import React from 'react';
import './CompanyFlyStyles.css';

const FlightModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  formData, 
  onInputChange, 
  editingFlight, 
  isDarkMode 
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${isDarkMode ? '' : 'light-mode'}`}>
        <div className="modal-header">
          <h2>{editingFlight ? 'تعديل الرحلة' : 'إنشاء رحلة جديدة'}</h2>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} className="flight-form">
          <div className="form-grid">
            <div className="form-group">
              <label>رقم الرحلة *</label>
              <input
                type="text"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={onInputChange}
                placeholder="مثال: SV123"
                required
              />
            </div>

            <div className="form-group">
              <label>شركة الطيران *</label>
              <input
                type="text"
                name="airline"
                value={formData.airline}
                onChange={onInputChange}
                placeholder="مثال: السعودية"
                required
              />
            </div>

            <div className="form-group">
              <label>مدين المغادرة *</label>
              <input
                type="text"
                name="departure"
                value={formData.departure}
                onChange={onInputChange}
                placeholder="مثال: الرياض"
                required
              />
            </div>

            <div className="form-group">
              <label>مدين الوصول *</label>
              <input
                type="text"
                name="arrival"
                value={formData.arrival}
                onChange={onInputChange}
                placeholder="مثال: دبي"
                required
              />
            </div>

            <div className="form-group">
              <label>وقت المغادرة *</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>وقت الوصول *</label>
              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>التاريخ *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>الطائرة *</label>
              <input
                type="text"
                name="aircraft"
                value={formData.aircraft}
                onChange={onInputChange}
                placeholder="مثال: Boeing 777"
                required
              />
            </div>

            <div className="form-group">
              <label>السعر ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onInputChange}
                placeholder="مثال: 1200"
                required
              />
            </div>

            <div className="form-group">
              <label>المقاعد المتاحة *</label>
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={onInputChange}
                placeholder="مثال: 45"
                required
              />
            </div>

            <div className="form-group">
              <label>إجمالي المقاعد *</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={onInputChange}
                placeholder="مثال: 180"
                required
              />
            </div>

            <div className="form-group">
              <label>البوابة</label>
              <input
                type="text"
                name="gate"
                value={formData.gate}
                onChange={onInputChange}
                placeholder="مثال: A12"
              />
            </div>

            <div className="form-group">
              <label>المرحل</label>
              <input
                type="text"
                name="terminal"
                value={formData.terminal}
                onChange={onInputChange}
                placeholder="مثال: 1"
              />
            </div>

            <div className="form-group">
              <label>الحالة</label>
              <select
                name="status"
                value={formData.status}
                onChange={onInputChange}
              >
                <option value="scheduled">مجدولة</option>
                <option value="boarding">صعود</option>
                <option value="departed">مغادرة</option>
                <option value="cancelled">ملغاة</option>
                <option value="delayed">متأخرة</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className={`btn-cancel ${isDarkMode ? '' : 'light-mode'}`}
              onClick={onClose}
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              className={`btn-submit ${isDarkMode ? '' : 'light-mode'}`}
            >
              {editingFlight ? 'تحديث الرحلة' : 'إنشاء الرحلة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightModal;
