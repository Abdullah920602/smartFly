import React from 'react';
import './CompanyFlyStyles.css';

const DashboardHeader = ({ onCreateFlight, isDarkMode }) => {
  return (
    <div className="dashboard-header">
      <h1>لوحة تحكم شركة الطيران</h1>
      <button 
        className={`btn-create ${isDarkMode ? '' : 'light-mode'}`}
        onClick={onCreateFlight}
      >
        <i className="fas fa-plus me-2"></i>
        إنشاء رحلة جديدة
      </button>
    </div>
  );
};

export default DashboardHeader;
