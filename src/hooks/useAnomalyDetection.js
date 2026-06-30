import { useState, useEffect } from 'react';
import { detectAnomalies, detectSpikeAnomalies } from '../utils/anomalyDetector';

export function useAnomalyDetection(data, options = {}) {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      setLoading(true);
      
      const regularAnomalies = detectAnomalies(data, options.thresholdMultiplier);
      const spikeAnomalies = detectSpikeAnomalies(data, options.spikeThreshold);
      
      setAnomalies([...regularAnomalies, ...spikeAnomalies]);
      setLoading(false);
    }
  }, [data, options.thresholdMultiplier, options.spikeThreshold]);

  return { anomalies, loading };
}