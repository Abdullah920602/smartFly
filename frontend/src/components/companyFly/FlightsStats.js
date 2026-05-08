import React from 'react';
import './CompanyFlyStyles.css';

const FlightsStats = ({ flights, totalPassengers, totalRevenue, getStatusCount, isDarkMode }) => {
  return (
    <div className="flights-stats">
      <div className={`stat-card ${isDarkMode ? '' : 'light-mode'}`}>
        <div className={`stat-icon ${isDarkMode ? '' : 'light-mode'}`}>
          <i className="fas fa-plane"></i>
        </div>
        <div className="stat-info">
          <h3>{flights.length}</h3>
          <p>إجمالي الرحلات</p>
        </div>
      </div>
      
      <div className={`stat-card ${isDarkMode ? '' : 'light-mode'}`}>
        <div className={`stat-icon ${isDarkMode ? '' : 'light-mode'}`}>
          <i className="fas fa-users"></i>
        </div>
        <div className="stat-info">
          <h3>{totalPassengers}</h3>
          <p>إجمالي المسافرين</p>
        </div>
      </div>
      
      <div className={`stat-card ${isDarkMode ? '' : 'light-mode'}`}>
        <div className={`stat-icon ${isDarkMode ? '' : 'light-mode'}`}>
          <i className="fas fa-dollar-sign"></i>
        </div>
        <div className="stat-info">
          <h3>${totalRevenue.toLocaleString()}</h3>
          <p>إجمالي الإيرادات</p>
        </div>
      </div>
      
      <div className={`stat-card ${isDarkMode ? '' : 'light-mode'}`}>
        <div className={`stat-icon ${isDarkMode ? '' : 'light-mode'}`}>
          <i className="fas fa-clock"></i>
        </div>
        <div className="stat-info">
          <h3>{getStatusCount('scheduled')}</h3>
          <p>الرحلات المجدولة</p>
        </div>
      </div>
    </div>
  );
};

export default FlightsStats;
