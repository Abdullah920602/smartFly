import React from 'react';
import './CompanyFlyStyles.css';

const DashboardTabs = ({ activeTab, setActiveTab, flightsCount, isDarkMode }) => {
  return (
    <div className="dashboard-tabs">
      <button 
        className={`tab-btn ${activeTab === 'flights' ? 'active' : ''} ${isDarkMode ? '' : 'light-mode'}`}
        onClick={() => setActiveTab('flights')}
      >
        <i className="fas fa-plane me-2"></i>
        الرحلات ({flightsCount})
      </button>
      <button 
        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''} ${isDarkMode ? '' : 'light-mode'}`}
        onClick={() => setActiveTab('analytics')}
      >
        <i className="fas fa-chart-bar me-2"></i>
        التحليلات
      </button>
    </div>
  );
};

export default DashboardTabs;
