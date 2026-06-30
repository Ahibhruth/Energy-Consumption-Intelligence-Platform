export function AnomalyCard({ anomaly, onAcknowledge }) {
  const severityColors = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'blue'
  };

  return (
    <div className={`anomaly-card anomaly-${anomaly.severity}`}>
      <div className="anomaly-header">
        <div className="anomaly-type">
          <span className="anomaly-icon">⚠️</span>
          <h4>{anomaly.type}</h4>
        </div>
        <span className={`badge badge-${severityColors[anomaly.severity]}`}>
          {anomaly.severity.toUpperCase()}
        </span>
      </div>
      <div className="anomaly-details">
        <p><strong>Household:</strong> {anomaly.LCLid}</p>
        <p><strong>Cluster:</strong> {anomaly.cluster_id}</p>
        <p><strong>Detected:</strong> {new Date(anomaly.detectedAt).toLocaleString()}</p>
        <p><strong>Description:</strong> {anomaly.description}</p>
        <p><strong>Value:</strong> {anomaly.value} kWh (Expected: {anomaly.expected} ± {anomaly.threshold} kWh)</p>
      </div>
      <div className="anomaly-actions">
        {!anomaly.acknowledged && (
          <button className="btn btn-primary" onClick={() => onAcknowledge(anomaly.id)}>
            Acknowledge
          </button>
        )}
        {anomaly.acknowledged && (
          <span className="badge badge-green">Acknowledged</span>
        )}
      </div>
    </div>
  );
}