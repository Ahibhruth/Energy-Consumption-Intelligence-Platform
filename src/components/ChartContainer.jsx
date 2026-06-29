/**
 * Chart Container Component
 * Wraps Chart.js charts
 */

import '../styles/charts.css';

export function ChartContainer({ title, children }) {
  return (
    <div className="chart-panel">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        {children}
      </div>
    </div>
  );
}