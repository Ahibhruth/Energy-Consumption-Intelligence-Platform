/**
 * Model Metrics Page
 * Shows RMSE/MAE comparison
 */

import { useDataLoader } from '../hooks/useDataLoader';
import { SQL } from '../services/queries';
import { Topbar } from '../components/Topbar';
import { KpiCard } from '../components/KpiCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ChartContainer } from '../components/ChartContainer';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function ModelMetricsPage() {
  const { data, loading, error } = useDataLoader(SQL.allMetrics);

  if (loading) return <LoadingSpinner message="Loading model metrics..." />;
  if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  if (!data) return null;

  const cluster0 = data.find(m => m.model === 'cluster_0') || {};
  const cluster1 = data.find(m => m.model === 'cluster_1') || {};
  const global = data.find(m => m.model === 'global') || {};

  // RMSE Chart
  const rmseChartData = {
    labels: ['Cluster 0', 'Cluster 1', 'Global'],
    datasets: [{
      label: 'RMSE (kWh)',
      data: [cluster0.rmse, cluster1.rmse, global.rmse],
      backgroundColor: ['#3acc80', '#f0a030', '#e84a4a'],
      borderColor: ['#2aa860', '#d68010', '#c02e2e'],
      borderWidth: 2
    }]
  };

  // MAE Chart
  const maeChartData = {
    labels: ['Cluster 0', 'Cluster 1', 'Global'],
    datasets: [{
      label: 'MAE (kWh)',
      data: [cluster0.mae, cluster1.mae, global.mae],
      backgroundColor: ['#3acc80', '#f0a030', '#e84a4a'],
      borderColor: ['#2aa860', '#d68010', '#c02e2e'],
      borderWidth: 2
    }]
  };

  // Calculate improvement
  const c0Improvement = ((global.rmse - cluster0.rmse) / global.rmse * 100).toFixed(1);
  const c1Diff = ((cluster1.rmse - global.rmse) / global.rmse * 100).toFixed(1);

  return (
    <div className="page">
      <Topbar
        pageTitle="Model Performance Metrics"
        pageSubtitle="Accuracy comparison · RMSE & MAE analysis"
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          label="Cluster 0 Improvement"
          value={`${c0Improvement}%`}
          unit="better than global"
          color="green"
        />
        <KpiCard
          label="Cluster 1 Difference"
          value={`${c1Diff}%`}
          unit="vs global"
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <ChartContainer title="Root Mean Squared Error (RMSE)">
          <Bar data={rmseChartData} />
        </ChartContainer>

        <ChartContainer title="Mean Absolute Error (MAE)">
          <Bar data={maeChartData} />
        </ChartContainer>
      </div>

      {/* Explanation */}
      <div className="panel">
        <h3 className="panel-title">What This Means</h3>
        <div className="explanation">
          <div className="exp-item">
            <strong>RMSE (Root Mean Squared Error)</strong>
            <p>Measures average prediction error. Lower is better. Cluster 0's {cluster0.rmse?.toFixed(4)} is {c0Improvement}% better than global baseline.</p>
          </div>
          <div className="exp-item">
            <strong>MAE (Mean Absolute Error)</strong>
            <p>Average absolute prediction error. Cluster 0's {cluster0.mae?.toFixed(4)} shows consistent accuracy.</p>
          </div>
          <div className="exp-item">
            <strong>Cluster 1 Higher Error</strong>
            <p>Cluster 1 households are inherently more variable. Higher error is expected for this group — it's a finding, not a bug.</p>
          </div>
        </div>
      </div>
    </div>
  );
}