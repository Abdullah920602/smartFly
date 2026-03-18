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
      <button
        className="btn btn-outline-light voice-search-btn"
        onClick={startVoiceSearch}
        disabled={isRecording || !voiceSearchSupported}
        title={voiceSearchSupported ? "البحث الصوتي" : "البحث الصوتي غير متاح في هذا المتصفح"}
      >
        {isRecording ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            جاري التسجيل...
          </>
        ) : !voiceSearchSupported ? (
          <>
            <i className="fas fa-microphone-slash me-2"></i>
            صوت غير متاح
          </>
        ) : (
          <>
            <i className="fas fa-microphone me-2"></i>
            صوت
          </>
        )}
      </button>
      <button
        className="btn btn-primary"
        onClick={handleAiSearch}
        disabled={isAiSearching || !aiSearchTerm.trim()}
      >
        {isAiSearching ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            جاري البحث...
          </>
        ) : (
          <>
            <i className="fas fa-search me-2"></i>
            بحث ذكي
          </>
        )}
      </button>
    </div>
  </div>
);

export default AiSearchBox;
