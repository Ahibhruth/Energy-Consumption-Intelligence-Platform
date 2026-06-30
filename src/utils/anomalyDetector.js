export function detectAnomalies(data, thresholdMultiplier = 2) {
  if (!data || data.length === 0) return [];

  const values = data.map(d => d.prediction || d.energy);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  const threshold = stdDev * thresholdMultiplier;

  const anomalies = [];
  
  data.forEach((point, index) => {
    const value = point.prediction || point.energy;
    const deviation = Math.abs(value - mean);
    
    if (deviation > threshold) {
      let severity = 'low';
      if (deviation > threshold * 3) severity = 'critical';
      else if (deviation > threshold * 2) severity = 'high';
      else if (deviation > threshold * 1.5) severity = 'medium';

      anomalies.push({
        id: `anomaly-${Date.now()}-${index}`,
        type: 'unusual_consumption',
        severity,
        LCLid: point.LCLid || 'unknown',
        cluster_id: point.cluster_id,
        detectedAt: point.DateTime || new Date().toISOString(),
        description: `Unusual energy consumption detected`,
        value,
        expected: mean,
        threshold,
        acknowledged: false
      });
    }
  });

  return anomalies;
}

export function detectSpikeAnomalies(data, spikeThreshold = 1.5) {
  const anomalies = [];
  
  for (let i = 2; i < data.length; i++) {
    const current = data[i].prediction || data[i].energy;
    const previous = data[i - 1].prediction || data[i - 1].energy;
    const prevPrevious = data[i - 2].prediction || data[i - 2].energy;
    
    const avgPrevious = (previous + prevPrevious) / 2;
    const ratio = current / avgPrevious;
    
    if (ratio > spikeThreshold) {
      anomalies.push({
        id: `spike-${Date.now()}-${i}`,
        type: 'consumption_spike',
        severity: ratio > 2 ? 'critical' : ratio > 1.75 ? 'high' : 'medium',
        LCLid: data[i].LCLid || 'unknown',
        cluster_id: data[i].cluster_id,
        detectedAt: data[i].DateTime || new Date().toISOString(),
        description: `Sudden consumption spike detected`,
        value: current,
        expected: avgPrevious,
        threshold: spikeThreshold * avgPrevious,
        acknowledged: false
      });
    }
  }
  
  return anomalies;
}