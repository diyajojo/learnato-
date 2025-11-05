import React from 'react';
import { Bot, X } from 'lucide-react';

const SummaryPopup = ({ summary, onClose }) => {
  let summaryText = '';
  let detailsText = '';

  // Check if the summary follows the **Summary:** and **Details:** format
  if (summary.startsWith('**Summary:**')) {
    const parts = summary.split('**Details:**');
    summaryText = parts[0].replace('**Summary:**', '').trim();
    detailsText = parts[1] ? parts[1].trim() : '';
  } else {
    // If it doesn't follow the format, just show the whole text as details
    detailsText = summary;
  }

  return (
    <div className="ai-summary-overlay" onClick={onClose}>
      <div className="ai-summary-content" onClick={(e) => e.stopPropagation()}>
        <div className="ai-summary-header">
          <div className="ai-summary-title-group">
            <Bot size={22} className="ai-summary-icon" />
            <h3>AI Summary</h3>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        <div className="ai-summary-body">
          {summaryText && (
            <div className="ai-summary-section">
              <h4>Summary</h4>
              <p>{summaryText}</p>
            </div>
          )}
          
          <div className="ai-summary-section">
            {/* Show "Details" title only if there was also a summary */}
            {summaryText && <h4>Details</h4>} 
            
            {/* Handle newlines in the details part */}
            {detailsText.split('\n').map((line, i) => (
              <p key={i} className="ai-summary-line">{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPopup;