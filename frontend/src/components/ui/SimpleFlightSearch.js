import React, { useState } from 'react';

const SimpleFlightSearch = ({ onSearch, isSearching }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const quickSearches = [
    'رحلات عمان',
    'الملكية الأردنية',
    'رحلات اليوم',
    'أرخص الرحلات'
  ];

  return (
    <div className="simple-search-container" style={{
      background: 'var(--jordan-white)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: 'var(--soft-shadow)',
      marginBottom: '24px'
    }}>
      <div className="search-header mb-3">
        <h5 style={{ color: 'var(--jordan-royal)', margin: 0 }}>
          <i className="fas fa-search me-2" style={{ color: 'var(--jordan-gold)' }}></i>
          البحث السريع
        </h5>
      </div>
      
      <div className="search-input-group">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="ابحث عن رحلتك... مثال: رحلة من عمان إلى دبي"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              border: '2px solid #e2e8f0',
              borderRadius: '12px 0 0 12px',
              padding: '12px 16px',
              fontSize: '16px'
            }}
          />
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={isSearching}
            style={{
              borderRadius: '0 12px 12px 0',
              padding: '12px 20px',
              background: 'var(--primary-gradient)',
              border: 'none'
            }}
          >
            {isSearching ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </button>
        </div>
      </div>

      <div className="quick-searches mt-3">
        <small className="text-muted mb-2 d-block">بحث سريع:</small>
        <div className="d-flex flex-wrap gap-2">
          {quickSearches.map((search, index) => (
            <button
              key={index}
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setSearchTerm(search);
                onSearch(search);
              }}
              style={{
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '12px',
                transition: 'var(--quick-transition)'
              }}
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleFlightSearch;
