/**
 * Overview Page
 * Shows KPIs, model metrics, demand overview
 */

import { useDataLoaderBatch } from '../hooks/useDataLoader';
import { SQL } from '../services/queries';
import { Topbar } from '../components/Topbar';
import { KpiCard } from '../components/KpiCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ChartContainer } from '../components/ChartContainer';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Presentational-only metadata for each risk bucket (labels/sub-text).
// Mirrors the same thresholds already used on the Alerts page —
// no new business logic, just descriptive copy for the UI.
const RISK_META = {
  High:   { sub: 'prediction > 2.0 kWh · initiate response', dot: '#dc3a3a', text: '#dc3a3a' },
  Medium: { sub: '1.0 – 2.0 kWh · monitor closely',          dot: '#d9870e', text: '#d9870e' },
  Low:    { sub: '0.5 – 1.0 kWh · log for analysis',          dot: '#2f6fed', text: '#2f6fed' },
  Safe:   { sub: 'below 0.5 kWh · no action',                 dot: '#1f9d57', text: '#1f9d57' }
};

export function OverviewPage() {
  const sqlQueries = [
    SQL.modelMetrics,
    SQL.householdsByCluster,
    SQL.sampleHouseholdTimeSeries,
    SQL.peakDemandHours,
    SQL.totalPredictions,
    SQL.riskDistribution
  ];

  const { data, loading, error } = useDataLoaderBatch(sqlQueries);

  if (loading) return <LoadingSpinner message="Loading energy overview..." />;
  if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  if (!data) return null;

  const [metrics, clusters, timeSeries, peakHours, total, riskBuckets] = data;

  // Calculate metrics
  const cluster0 = metrics.find(m => m.model === 'cluster_0') || {};
  const cluster1 = metrics.find(m => m.model === 'cluster_1') || {};
  const global = metrics.find(m => m.model === 'global') || {};
  
  const improvement = cluster0.rmse 
    ? (((global.rmse - cluster0.rmse) / global.rmse) * 100).toFixed(1)
    : 0;

  const totalHouseholds = clusters.reduce((sum, c) => sum + c.count, 0);

  // Peak demand hour — derived from the peakHours data we already fetch,
  // no new query: find the hour with the highest avg_demand.
  const peakHourEntry = peakHours.reduce(
    (max, p) => (p.avg_demand > (max?.avg_demand ?? -Infinity) ? p : max),
    null
  );

  // Chart data
  const clusterChartData = {
    labels: clusters.map(c => `Cluster ${c.cluster}`),
    datasets: [{
      label: 'Households',
      data: clusters.map(c => c.count),
      backgroundColor: ['#1f9d57', '#d9870e']
    }]
  };

  const peakChartData = {
    labels: peakHours.map(p => `${p.hour}:00`),
    datasets: [{
      label: 'Avg Demand (kWh)',
      data: peakHours.map(p => p.avg_demand),
      borderColor: '#1f9d57',
      backgroundColor: 'rgba(31, 157, 87, 0.1)',
      fill: true
    }]
  };

  const forecastChartData = {
    labels: timeSeries.map((_, i) => `${i}h`),
    datasets: [
      {
        label: 'Actual Energy',
        data: timeSeries.map(t => t.energy),
        borderColor: '#1f9d57',
        backgroundColor: 'rgba(31, 157, 87, 0.1)'
      },
      {
        label: 'Predicted Energy',
        data: timeSeries.map(t => t.prediction),
        borderColor: '#2f6fed',
        backgroundColor: 'rgba(47, 111, 237, 0.1)'
      }
    ]
  };

  return (
    <div className="page">
      <Topbar 
        pageTitle="Demand Overview"
        pageSubtitle="Aggregate forecast · Smart Meter Network · 5,446 households"
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          label="Total Households"
          value={totalHouseholds.toLocaleString()}
          unit="meters"
          color="blue"
        />
        <KpiCard
          label="Model Improvement"
          value={improvement}
          unit="%"
          color="green"
        />
        <KpiCard
          label="Peak Demand Hour"
          value={peakHourEntry ? `${peakHourEntry.hour}:00` : '—'}
          unit={peakHourEntry ? `${peakHourEntry.avg_demand.toFixed(3)} kWh avg` : ''}
          color="amber"
        />
        <KpiCard
          label="Global RMSE"
          value={global.rmse?.toFixed(4)}
          unit="kWh"
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <ChartContainer title="Household Distribution by Cluster">
          <Bar data={clusterChartData} />
        </ChartContainer>

        <ChartContainer title="Peak Demand Hours (Last 24h)">
          <Line data={peakChartData} />
        </ChartContainer>
      </div>

      {/* Risk Level Breakdown — built from the same data powering the Alerts donut */}
      <div className="panel">
        <h3 className="panel-title">Risk Level Breakdown</h3>
        <div className="risk-breakdown">
          {[...riskBuckets].sort((a, b) => {
  const order = { High: 0, Medium: 1, Low: 2, Safe: 3 };
  return (order[a.risk_level] ?? 9) - (order[b.risk_level] ?? 9);
}).map((bucket, idx) => {
  const meta = RISK_META[bucket.risk_level] || { sub: '', dot: 'var(--text3)', text: 'var(--text3)' };
  return (
    <div className="risk-breakdown-row" key={idx}>
      <span className="risk-breakdown-dot" style={{ background: meta.dot }} />
      <div className="risk-breakdown-text">
        <div className="risk-breakdown-label">{bucket.risk_level} Risk</div>
        <div className="risk-breakdown-sub">{meta.sub}</div>
      </div>
      <div className="risk-breakdown-count" style={{ color: meta.text }}>
        {bucket.count.toLocaleString()}
      </div>
    </div>
  );
})}
        </div>
      </div>

      <ChartContainer title="Sample Household Forecast (MAC005271)">
        <Line data={forecastChartData} />
      </ChartContainer>
    </div>
  );
}