/**
 * Loading Spinner Component
 */

import '../styles/index.css';

export function LoadingSpinner({ message = 'Loading data...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}