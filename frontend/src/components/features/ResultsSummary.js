import React from 'react';

const ResultsSummary = ({ filteredFlights, flights, searchCriteria }) => (
  <div className="results-summary">
    <div className="row align-items-center">
      <div className="col-md-6">
        <h3>نتائج البحث</h3>
        <p className="text-muted">
          تم العثور على {filteredFlights.length} رحلة
          {filteredFlights.length !== flights.length && ` من أصل ${flights.length}`}
        </p>
        {searchCriteria && (
          <div className="ai-search-results">
            <h5><i className="fas fa-robot me-2"></i>تحليل الذكاء الاصطناعي:</h5>
            <div className="criteria-tags">
              {searchCriteria.departure && (
                <span className="badge bg-primary me-2"><i className="fas fa-plane-departure me-1"></i>من: {searchCriteria.departure}</span>
              )}
              {searchCriteria.arrival && (
                <span className="badge bg-success me-2"><i className="fas fa-plane-arrival me-1"></i>إلى: {searchCriteria.arrival}</span>
              )}
              {searchCriteria.airline && (
                <span className="badge bg-info me-2"><i className="fas fa-building me-1"></i>شركة: {searchCriteria.airline}</span>
              )}
              {searchCriteria.date && (
                <span className="badge bg-warning me-2"><i className="fas fa-calendar me-1"></i>تاريخ: {searchCriteria.date}</span>
              )}
              {searchCriteria.maxPrice && (
                <span className="badge bg-danger me-2"><i className="fas fa-dollar-sign me-1"></i>سعر: {searchCriteria.maxPrice} دينار</span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="col-md-6 text-end">
        <div className="sort-options">
          <span className="me-3">ترتيب حسب:</span>
          <select className="form-select form-select-sm d-inline-block w-auto">
            <option>الأقل سعراً</option>
            <option>الأعلى سعراً</option>
            <option>الأقرب موعداً</option>
            <option>الأبعد موعداً</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default ResultsSummary;
