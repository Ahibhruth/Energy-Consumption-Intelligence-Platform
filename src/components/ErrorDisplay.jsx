/**
 * Error Display Component
 */

import '../styles/index.css';

export function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="error-container">
      <h3>⚠️ Error Loading Data</h3>
      <p className="error-message">{error}</p>
      <button className="btn-primary" onClick={onRetry}>
        🔄 Retry
      </button>
    </div>
  );
}