export function calculateTrend(data) {
  if (!data || data.length < 2) return { slope: 0, intercept: 0, r2: 0 };

  const n = data.length;
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((a, b) => a + b, 0) / n;

  let ssxy = 0;
  let ssxx = 0;
  let ssyy = 0;

  data.forEach((y, x) => {
    ssxy += (x - xMean) * (y - yMean);
    ssxx += Math.pow(x - xMean, 2);
    ssyy += Math.pow(y - yMean, 2);
  });

  const slope = ssxy / ssxx;
  const intercept = yMean - slope * xMean;
  const r2 = Math.pow(ssxy, 2) / (ssxx * ssyy);

  return { slope, intercept, r2 };
}

export function forecastNextPeriods(data, periods = 7) {
  const trend = calculateTrend(data);
  const forecast = [];

  for (let i = 0; i < periods; i++) {
    const x = data.length + i;
    const predicted = trend.slope * x + trend.intercept;
    forecast.push(Math.max(0, predicted));
  }

  return {
    forecast,
    trend,
    confidence: Math.min(0.95, trend.r2 + 0.5)
  };
}

export function detectSeasonality(data, period = 7) {
  if (data.length < period * 2) return { hasSeasonality: false, pattern: [] };

  const pattern = Array(period).fill(0);
  const counts = Array(period).fill(0);

  data.forEach((value, index) => {
    const pos = index % period;
    pattern[pos] += value;
    counts[pos]++;
  });

  const normalizedPattern = pattern.map((sum, i) => sum / counts[i]);
  const mean = normalizedPattern.reduce((a, b) => a + b, 0) / period;
  const variance = normalizedPattern.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;

  return {
    hasSeasonality: variance > mean * 0.1,
    pattern: normalizedPattern,
    strength: Math.sqrt(variance) / mean
  };
}

export function generateInsights(timeSeries, clusterData) {
  const insights = [];

  // Trend analysis
  const energyValues = timeSeries.map(d => d.energy || d.prediction);
  const trend = calculateTrend(energyValues);

  if (Math.abs(trend.slope) > 0.01) {
    insights.push({
      type: 'trend',
      title: trend.slope > 0 ? 'Increasing Consumption Trend' : 'Decreasing Consumption Trend',
      description: `Detected a ${trend.slope > 0 ? 'rising' : 'falling'} trend in energy consumption`,
      value: `${(trend.slope * 100).toFixed(1)}%`,
      unit: '/period',
      confidence: trend.r2
    });
  }

  // Seasonality check
  const seasonality = detectSeasonality(energyValues);
  if (seasonality.hasSeasonality) {
    insights.push({
      type: 'pattern',
      title: 'Weekly Pattern Detected',
      description: `Strong weekly consumption pattern identified (strength: ${(seasonality.strength * 100).toFixed(1)}%)`,
      confidence: Math.min(0.95, seasonality.strength + 0.3)
    });
  }

  // Forecast
  const forecast = forecastNextPeriods(energyValues);
  const avgForecast = forecast.forecast.reduce((a, b) => a + b, 0) / forecast.forecast.length;
  const avgCurrent = energyValues.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const change = ((avgForecast - avgCurrent) / avgCurrent * 100);

  if (Math.abs(change) > 5) {
    insights.push({
      type: 'forecast',
      title: change > 0 ? 'Expected Demand Increase' : 'Expected Demand Decrease',
      description: `Forecast indicates ${change > 0 ? 'higher' : 'lower'} demand in the coming week`,
      value: `${change.toFixed(1)}%`,
      confidence: forecast.confidence
    });
  }

  return insights;
}