/**
 * KPI Metric Card Component
 */

import '../styles/cards.css';

export function KpiCard({ label, value, unit, trend, color = 'blue' }) {
  return (
    <div className={`kpi-card kpi-${color}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-unit">{unit}</div>
      {trend && <div className={`kpi-trend ${trend.direction}`}>{trend.text}</div>}
    </div>
  );
}