import React from 'react';

const AiSearchBox = ({ aiSearchTerm, setAiSearchTerm, handleAiSearch, isAiSearching, startVoiceSearch, isRecording, voiceSearchSupported }) => (
  <div className="ai-search-box">
    <div className="search-header">
      <h4><i className="fas fa-robot me-2"></i>البحث بالذكاء الاصطناعي</h4>
      <p>اكتب استعلامك باللغة الطبيعية وسيقوم الذكاء الاصطناعي بتحليله</p>
    </div>
    <div className="input-group">
      <span className="input-group-text ai-search-icon">
        <i className="fas fa-magic"></i>
      </span>
      <input
        type="text"
        className="form-control"
        placeholder="مثال: رحلة من عمان إلى دبي غداً بسعر أقل من 500 دينار..."
        value={aiSearchTerm}
        onChange={e => setAiSearchTerm(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleAiSearch()}
      />
      <div className="action-buttons">
        <button
          className="btn btn-outline-light voice-search-btn"
          onClick={startVoiceSearch}
          disabled={isRecording || !voiceSearchSupported}
          title={voiceSearchSupported ? "البحث الصوتي" : "البحث الصوتي غير متاح في هذا المتصفح"}
        >
          {isRecording ? (
            <i className="fas fa-stop"></i>
          ) : !voiceSearchSupported ? (
            <i className="fas fa-microphone-slash"></i>
          ) : (
            <i className="fas fa-microphone"></i>
          )}
        </button>
        <button
          className="btn btn-primary"
          onClick={handleAiSearch}
          disabled={isAiSearching || !aiSearchTerm.trim()}
        >
          {isAiSearching ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-search"></i>
          )}
        </button>
      </div>
    </div>
  </div>
);

export default AiSearchBox;
