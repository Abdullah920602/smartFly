import React from 'react';
import './CompanyFlyStyles.css';

const AnalyticsSection = ({ 
  flights, 
  totalRevenue, 
  totalPassengers, 
  getStatusCount, 
  isDarkMode 
}) => {
  const averageRevenue = flights.length > 0 ? Math.round(totalRevenue / flights.length) : 0;

  return (
    <div className="analytics-section">
      <div className="analytics-grid">
        <div className={`chart-container ${isDarkMode ? '' : 'light-mode'}`}>
          <h3>توزيع حالة الرحلات</h3>
          <div className="chart-placeholder">
            <div className="status-chart">
              <div className="chart-item">
                <div className="chart-color scheduled"></div>
                <span>مجدولة: {getStatusCount('scheduled')}</span>
              </div>
              <div className="chart-item">
                <div className="chart-color boarding"></div>
                <span>صعود: {getStatusCount('boarding')}</span>
              </div>
              <div className="chart-item">
                <div className="chart-color departed"></div>
                <span>مغادرة: {getStatusCount('departed')}</span>
              </div>
              <div className="chart-item">
                <div className="chart-color cancelled"></div>
                <span>ملغاة: {getStatusCount('cancelled')}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`chart-container ${isDarkMode ? '' : 'light-mode'}`}>
          <h3>نظرة عامة على الإيرادات</h3>
          <div className="chart-placeholder">
            <div className="revenue-summary">
              <div className="revenue-item">
                <span className="label">إجمالي الإيرادات:</span>
                <span className="value">${totalRevenue.toLocaleString()}</span>
              </div>
              <div className="revenue-item">
                <span className="label">متوسط لكل رحلة:</span>
                <span className="value">${averageRevenue}</span>
              </div>
              <div className="revenue-item">
                <span className="label">إجمالي المسافرين:</span>
                <span className="value">{totalPassengers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
