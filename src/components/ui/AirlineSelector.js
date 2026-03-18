import React from 'react';

const AirlineSelector = ({ selectedAirline, onAirlineSelect, airlines, flightCounts }) => {
  return (
    <div className="airline-selector" style={{
      background: 'var(--jordan-white)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: 'var(--soft-shadow)',
      marginBottom: '24px'
    }}>
      <div className="selector-header mb-4">
        <h5 style={{ color: 'var(--jordan-royal)', margin: 0, fontWeight: '600' }}>
          <i className="fas fa-building me-2" style={{ color: 'var(--jordan-gold)' }}></i>
          شركات الطيران الأردنية
        </h5>
        <p style={{ color: 'var(--jordan-stone)', fontSize: '14px', margin: '8px 0 0' }}>
          اختر شركة طيران لعرض رحلاتها فقط
        </p>
      </div>
      
      <div className="airlines-grid">
        <div className="row g-3">
          {/* زر عرض جميع الشركات */}
          <div className="col-md-3 col-sm-6">
            <button
              className={`airline-card w-100 ${!selectedAirline ? 'selected' : ''}`}
              onClick={() => onAirlineSelect('')}
              style={{
                background: !selectedAirline ? 'var(--primary-gradient)' : 'var(--jordan-cream)',
                color: !selectedAirline ? 'var(--jordan-white)' : 'var(--jordan-royal)',
                border: `2px solid ${!selectedAirline ? 'var(--jordan-royal)' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '16px',
                transition: 'var(--smooth-transition)',
                cursor: 'pointer'
              }}
            >
              <div className="airline-icon mb-2">
                <i className="fas fa-globe" style={{ 
                  fontSize: '24px',
                  color: !selectedAirline ? 'var(--jordan-gold)' : 'var(--jordan-royal)'
                }}></i>
              </div>
              <div className="airline-name" style={{ fontWeight: '600', fontSize: '14px' }}>
                جميع الشركات
              </div>
              <div className="flight-count" style={{ fontSize: '12px', opacity: 0.8 }}>
                {flightCounts?.total || 0} رحلة
              </div>
            </button>
          </div>
          
          {/* أزرار شركات الطيران */}
          {airlines.map(airline => (
            <div key={airline} className="col-md-3 col-sm-6">
              <button
                className={`airline-card w-100 ${selectedAirline === airline ? 'selected' : ''}`}
                onClick={() => onAirlineSelect(selectedAirline === airline ? '' : airline)}
                style={{
                  background: selectedAirline === airline ? 'var(--primary-gradient)' : 'var(--jordan-cream)',
                  color: selectedAirline === airline ? 'var(--jordan-white)' : 'var(--jordan-royal)',
                  border: `2px solid ${selectedAirline === airline ? 'var(--jordan-royal)' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'var(--smooth-transition)',
                  cursor: 'pointer'
                }}
              >
                <div className="airline-icon mb-2">
                  <i className="fas fa-plane" style={{ 
                    fontSize: '24px',
                    color: selectedAirline === airline ? 'var(--jordan-gold)' : 'var(--jordan-royal)'
                  }}></i>
                </div>
                <div className="airline-name" style={{ fontWeight: '600', fontSize: '14px' }}>
                  {airline}
                </div>
                <div className="flight-count" style={{ fontSize: '12px', opacity: 0.8 }}>
                  {flightCounts?.[airline] || 0} رحلة
                </div>
                {selectedAirline === airline && (
                  <div className="selected-indicator mt-2">
                    <i className="fas fa-check-circle" style={{ color: 'var(--jordan-gold)' }}></i>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {selectedAirline && (
        <div className="selected-airline-info mt-3" style={{
          background: 'var(--jordan-cream)',
          borderRadius: '8px',
          padding: '12px',
          borderLeft: '4px solid var(--jordan-gold)'
        }}>
          <small style={{ color: 'var(--jordan-royal)' }}>
            <i className="fas fa-filter me-1"></i>
            عرض رحلات شركة <strong>{selectedAirline}</strong> فقط
          </small>
        </div>
      )}
    </div>
  );
};

export default AirlineSelector;
