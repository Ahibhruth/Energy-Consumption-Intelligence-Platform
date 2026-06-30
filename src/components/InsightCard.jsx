export function InsightCard({ insight }) {
  const typeIcons = {
    trend: '📈',
    forecast: '🔮',
    correlation: '🔗',
    recommendation: '💡',
    alert: '⚠️'
  };

  return (
    <div className={`insight-card insight-${insight.type}`}>
      <div className="insight-icon">{typeIcons[insight.type] || '📊'}</div>
      <div className="insight-content">
        <h4>{insight.title}</h4>
        <p>{insight.description}</p>
        {insight.value && (
          <div className="insight-value">
            <strong>{insight.value}</strong>
            {insight.unit && <span className="insight-unit">{insight.unit}</span>}
          </div>
        )}
        {insight.confidence && (
          <div className="insight-confidence">
            Confidence: {(insight.confidence * 100).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}