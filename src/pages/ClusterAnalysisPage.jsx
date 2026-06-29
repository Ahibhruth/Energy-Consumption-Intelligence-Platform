/**
 * Cluster Analysis Page
 * Deep-dive into cluster-specific models
 */

import { useDataLoaderBatch } from '../hooks/useDataLoader';
import { SQL } from '../services/queries';
import { Topbar } from '../components/Topbar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ChartContainer } from '../components/ChartContainer';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function ClusterAnalysisPage() {
  const sqlQueries = [
    SQL.cluster0TimeSeries,
    SQL.cluster1TimeSeries,
    SQL.globalTimeSeries
  ];

  const { data, loading, error } = useDataLoaderBatch(sqlQueries);

  if (loading) return <LoadingSpinner message="Loading cluster data..." />;
  if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  if (!data) return null;

  const [cluster0, cluster1, global] = data;

  // Create comparison chart
  const comparisonChartData = {
    labels: cluster0.map((_, i) => `${i}h`),
    datasets: [
      {
        label: 'Cluster 0',
        data: cluster0.map(c => c.avg_prediction),
        borderColor: '#4a90e8',
        backgroundColor: 'rgba(74, 144, 232, 0.1)',
        tension: 0.3
      },
      {
        label: 'Cluster 1',
        data: cluster1.map(c => c.avg_prediction),
        borderColor: '#f0a030',
        backgroundColor: 'rgba(240, 160, 48, 0.1)',
        tension: 0.3
      },
      {
        label: 'Global Baseline',
        data: global.map(c => c.avg_prediction),
        borderColor: '#e84a4a',
        backgroundColor: 'rgba(232, 74, 74, 0.1)',
        borderDash: [5, 5],
        tension: 0.3
      }
    ]
  };

  return (
    <div className="page">
      <Topbar
        pageTitle="Cluster Deep-Dive Analysis"
        pageSubtitle="Model-specific demand profiles · 48-hour forecast"
      />

      {/* Model Comparison */}
      <ChartContainer title="Cluster Model Comparison (48h)">
        <Line data={comparisonChartData} />
      </ChartContainer>

      {/* Insights */}
      <div className="panel">
        <h3 className="panel-title">Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Cluster 0 Model</h4>
            <p>Best for stable consumption patterns</p>
            <p className="metric">3,768 households</p>
          </div>
          <div className="insight-card">
            <h4>Cluster 1 Model</h4>
            <p>Specialized for variable high-demand households</p>
            <p className="metric">1,678 households</p>
          </div>
          <div className="insight-card">
            <h4>Global Baseline</h4>
            <p>Average across all households</p>
            <p className="metric">Comparison reference</p>
          </div>
        </div>
      </div>
    </div>
  );
}