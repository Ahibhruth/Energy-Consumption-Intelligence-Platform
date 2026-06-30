import { useState, useMemo } from 'react';
import { useDataLoaderBatch } from '../hooks/useDataLoader';
import { SQL } from '../services/queries';
import { Topbar } from '../components/Topbar';
import { KpiCard } from '../components/KpiCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { detectAnomalies, detectSpikeAnomalies } from '../utils/anomalyDetector';

const SEVERITY_BADGE = {
  critical: 'high',
  high: 'high',
  medium: 'medium',
  low: 'low'
};

const FILTERS = ['all', 'critical', 'high', 'medium', 'low'];

export function AnomalyDetectionPage() {
  const sqlQueries = [SQL.anomalySampleData];
  const { data, loading, error } = useDataLoaderBatch(sqlQueries);

  const [filter, setFilter] = useState('all');

  // Compute anomalies client-side from real data — no fetch, no fabrication
  const anomalies = useMemo(() => {
    if (!data) return [];
    const [rows] = data;

    const normalized = rows.map(r => ({
      LCLid: r.LCLid,
      cluster_id: r.cluster_id,
      DateTime: r.DateTime,
      prediction: r.prediction
    }));

    const statistical = detectAnomalies(normalized, 2);
    const spikes = detectSpikeAnomalies(normalized, 1.5);

    return [...statistical, ...spikes].sort(
      (a, b) => new Date(b.detectedAt) - new Date(a.detectedAt)
    );
  }, [data]);

  if (loading) return <LoadingSpinner message="Scanning for anomalies..." />;
  if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  if (!data) return null;

  const stats = {
    total: anomalies.length,
    critical: anomalies.filter(a => a.severity === 'critical').length,
    high: anomalies.filter(a => a.severity === 'high').length,
    medium: anomalies.filter(a => a.severity === 'medium').length
  };

  const filteredAnomalies = anomalies.filter(a => filter === 'all' || a.severity === filter);

  return (
    <div className="page">
      <Topbar
        pageTitle="Anomaly Detection"
        pageSubtitle="Statistical outlier detection across recent household readings"
      />

      <div className="kpi-grid">
        <KpiCard label="Total Anomalies" value={stats.total.toLocaleString()} unit="detected" color="blue" />
        <KpiCard label="Critical" value={stats.critical.toLocaleString()} unit="severity" color="red" />
        <KpiCard label="High" value={stats.high.toLocaleString()} unit="severity" color="amber" />
        <KpiCard label="Medium" value={stats.medium.toLocaleString()} unit="severity" color="green" />
      </div>

      <div className="panel">
        <h3 className="panel-title">Filter by Severity</h3>
        <div className="filter-bar">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="anomalies-grid">
        {filteredAnomalies.length === 0 ? (
          <div className="panel">
            <p className="text-center mt-md">No anomalies found for the selected filter.</p>
          </div>
        ) : (
          filteredAnomalies.slice(0, 60).map(anomaly => (
            <div key={anomaly.id} className={`anomaly-card anomaly-${anomaly.severity}`}>
              <div className="anomaly-header">
                <div className="anomaly-type">
                  <span className="anomaly-icon">⚠️</span>
                  <h4>{anomaly.type === 'consumption_spike' ? 'Consumption Spike' : 'Unusual Consumption'}</h4>
                </div>
                <span className={`badge badge-${SEVERITY_BADGE[anomaly.severity]}`}>
                  {anomaly.severity.toUpperCase()}
                </span>
              </div>
              <div className="anomaly-details">
                <p><strong>Household:</strong> <span className="font-mono">{anomaly.LCLid}</span></p>
                <p><strong>Cluster:</strong> {anomaly.cluster_id}</p>
                <p><strong>Detected:</strong> {new Date(anomaly.detectedAt).toLocaleString()}</p>
                <p>
                  <strong>Value:</strong> {anomaly.value.toFixed(3)} kWh
                  {' '}(expected {anomaly.expected.toFixed(3)} ± {anomaly.threshold.toFixed(3)} kWh)
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredAnomalies.length > 60 && (
        <p className="text-center text-3 mt-sm">
          Showing 60 of {filteredAnomalies.length.toLocaleString()} anomalies.
        </p>
      )}
    </div>
  );
}
