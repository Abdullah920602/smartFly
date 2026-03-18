import React from 'react';

const SimplifiedFilters = ({ filters, onFilterChange, onClearFilters, airlines, cities }) => {
  return (
    <div className="simplified-filters" style={{
      background: 'var(--jordan-white)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: 'var(--soft-shadow)',
      marginBottom: '24px'
    }}>
      <div className="row g-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label" style={{ color: 'var(--jordan-royal)', fontWeight: '600', fontSize: '14px' }}>
            شركة الطيران
          </label>
          <select
            className="form-select"
            value={filters.airline}
            onChange={(e) => onFilterChange('airline', e.target.value)}
          >
            <option value="">جميع الشركات</option>
            {airlines.map(airline => (
              <option key={airline} value={airline}>{airline}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-3">
          <label className="form-label" style={{ color: 'var(--jordan-royal)', fontWeight: '600', fontSize: '14px' }}>
            من
          </label>
          <select
            className="form-select"
            value={filters.departure}
            onChange={(e) => onFilterChange('departure', e.target.value)}
          >
            <option value="">أي مدينة</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-3">
          <label className="form-label" style={{ color: 'var(--jordan-royal)', fontWeight: '600', fontSize: '14px' }}>
            إلى
          </label>
          <select
            className="form-select"
            value={filters.arrival}
            onChange={(e) => onFilterChange('arrival', e.target.value)}
          >
            <option value="">أي مدينة</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-3">
          <button 
            className="btn btn-outline-secondary w-100"
            onClick={onClearFilters}
            style={{
              borderRadius: '12px',
              padding: '12px',
              transition: 'var(--smooth-transition)'
            }}
          >
            <i className="fas fa-times me-1"></i>
            مسح الفلاتر
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedFilters;
