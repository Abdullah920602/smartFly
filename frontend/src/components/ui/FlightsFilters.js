import React from 'react';

const FlightsFilters = ({ airlines, cities, priceRanges, filters, onFilterChange, onClearFilters }) => (
  <div className="filters-grid">
    {/* Airline Filter */}
    <div className="filter-group">
      <label>شركة الطيران</label>
      <select className="form-select" value={filters.airline} onChange={e => onFilterChange('airline', e.target.value)}>
        <option value="">جميع الشركات</option>
        {airlines.map(airline => <option key={airline} value={airline}>{airline}</option>)}
      </select>
    </div>
    {/* Departure Filter */}
    <div className="filter-group">
      <label>من</label>
      <select className="form-select" value={filters.departure} onChange={e => onFilterChange('departure', e.target.value)}>
        <option value="">جميع المدن</option>
        {cities.map(city => <option key={city} value={city}>{city}</option>)}
      </select>
    </div>
    {/* Arrival Filter */}
    <div className="filter-group">
      <label>إلى</label>
      <select className="form-select" value={filters.arrival} onChange={e => onFilterChange('arrival', e.target.value)}>
        <option value="">جميع المدن</option>
        {cities.map(city => <option key={city} value={city}>{city}</option>)}
      </select>
    </div>
    {/* Date Filter */}
    <div className="filter-group">
      <label>التاريخ</label>
      <input type="date" className="form-control" value={filters.date} onChange={e => onFilterChange('date', e.target.value)} />
    </div>
    {/* Price Range Filter */}
    <div className="filter-group">
      <label>نطاق السعر</label>
      <select className="form-select" value={filters.priceRange} onChange={e => onFilterChange('priceRange', e.target.value)}>
        {priceRanges.map(range => <option key={range.value} value={range.value}>{range.label}</option>)}
      </select>
    </div>
    {/* Clear Filters Button */}
    <div className="filter-group">
      <label>&nbsp;</label>
      <button className="btn btn-outline-secondary w-100" onClick={onClearFilters}>
        <i className="fas fa-times me-2"></i>مسح الفلاتر
      </button>
    </div>
  </div>
);

export default FlightsFilters;
