import { useState, useMemo } from 'react';
import { useDataLoaderBatch } from '../hooks/useDataLoader';
import { SQL } from '../services/queries';
import { Topbar } from '../components/Topbar';
import { KpiCard } from '../components/KpiCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { ChartContainer } from '../components/ChartContainer';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Maps a risk_level string from riskBuckets to KpiCard color + sub-copy.
// Presentational only — same thresholds already used below for the table.
const RISK_KPI_META = {
  High:   { color: 'red',   sub: 'prediction > 2.0 kWh' },
  Medium: { color: 'amber', sub: '1.0 – 2.0 kWh' },
  Low:    { color: 'blue',  sub: '0.5 – 1.0 kWh' },
  Safe:   { color: 'green', sub: 'below 0.5 kWh' }
};

const RISK_FILTERS = ['All', 'High', 'Medium', 'Low', 'Safe'];

export function AlertsPage() {
  const sqlQueries = [
    SQL.topRiskHouseholds,
    SQL.riskDistribution
  ];

  const { data, loading, error } = useDataLoaderBatch(sqlQueries);

  // Filter state — purely client-side, does not affect data fetching
  const [riskFilter, setRiskFilter] = useState('All');
  const [clusterFilter, setClusterFilter] = useState('All');

  if (loading) return <LoadingSpinner message="Loading alerts..." />;
  if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  if (!data) return null;

  const [topRisk, riskBuckets] = data;

  // Risk distribution chart — green/white theme colors
  const riskChartData = {
    labels: riskBuckets.map(r => r.risk_level),
    datasets: [{
      data: riskBuckets.map(r => r.count),
      backgroundColor: ['#dc3a3a', '#d9870e', '#f0d030', '#1f9d57'],
      borderColor: ['#b82828', '#b86c08', '#cdb010', '#15793f'],
      borderWidth: 2
    }]
  };

  // Compute risk level/color per household once (same logic as before)
  const rowsWithRisk = topRisk.map(household => {
    let riskLevel = 'Safe';
    let riskColor = 'safe';

    if (household.max_prediction > 2.0) {
      riskLevel = 'High';
      riskColor = 'high';
    } else if (household.max_prediction > 1.0) {
      riskLevel = 'Medium';
      riskColor = 'medium';
    } else if (household.max_prediction > 0.5) {
      riskLevel = 'Low';
      riskColor = 'low';
    }

    return { ...household, riskLevel, riskColor };
  });

  // Distinct cluster ids present in the data, for the cluster filter buttons
  const clusterOptions = useMemo
    ? Array.from(new Set(topRisk.map(h => h.cluster_id))).sort((a, b) => a - b)
    : [];

  // Apply filters
  const filteredRows = rowsWithRisk.filter(h => {
    const riskMatch = riskFilter === 'All' || h.riskLevel === riskFilter;
    const clusterMatch = clusterFilter === 'All' || h.cluster_id === clusterFilter;
    return riskMatch && clusterMatch;
  });

  return (
    <div className="page">
      <Topbar
        pageTitle="Risk Alerts"
        pageSubtitle="High-risk households · Demand response protocol"
      />

      {/* KPI Cards — from riskDistribution data */}
      <div className="kpi-grid">
        {riskBuckets.map((bucket, idx) => {
          const meta = RISK_KPI_META[bucket.risk_level] || { color: 'blue', sub: '' };
          return (
            <KpiCard
              key={idx}
              label={`${bucket.risk_level} Risk`}
              value={bucket.count.toLocaleString()}
              unit={meta.sub}
              color={meta.color}
            />
          );
        })}
      </div>

      {/* Risk Distribution */}
      <div className="chart-grid">
        <ChartContainer title="Household Risk Distribution">
          <Doughnut data={riskChartData} />
        </ChartContainer>
      </div>

      {/* Top Risk Households Table */}
      {/* Top Risk Households Table */}
      <div className="panel">
        <div className="table-header-row">
          <h3 className="panel-title">Highest Risk Households</h3>
          <span className="table-count">
            Showing {filteredRows.length.toLocaleString()} of {topRisk.length.toLocaleString()}
          </span>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <span className="filter-label">Filter by risk:</span>
          {RISK_FILTERS.map(level => (
            <button
              key={level}
              className={`filter-btn ${riskFilter === level ? 'active' : ''}`}
              onClick={() => setRiskFilter(level)}
            >
              {level}
            </button>
          ))}

          <span className="filter-label filter-label-spaced">Filter by cluster:</span>
          <button
            className={`filter-btn ${clusterFilter === 'All' ? 'active' : ''}`}
            onClick={() => setClusterFilter('All')}
          >
            All
          </button>
          {clusterOptions.map(clusterId => (
            <button
              key={clusterId}
              className={`filter-btn ${clusterFilter === clusterId ? 'active' : ''}`}
              onClick={() => setClusterFilter(clusterId)}
            >
              Cluster {clusterId}
            </button>
          ))}
        </div>

        {/* <div className="table-scroll">
          <table className="risk-table">
            <thead>
              <tr>
                <th>Household ID</th>
                <th>Cluster</th>
                <th>Peak Predicted (kWh)</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((household, idx) => (
                <tr key={idx}>
                  <td className="font-mono">{household.LCLid}</td>
                  <td>{household.cluster_id}</td>
                  <td className="font-mono">{household.max_prediction.toFixed(3)}</td>
                  <td>
                    <span className={`badge badge-${household.riskColor}`}>
                      {household.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
        <div className="table-scroll">
  <table className="risk-table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
    <colgroup>
      <col style={{ width: '35%' }} />
      <col style={{ width: '15%' }} />
      <col style={{ width: '30%' }} />
      <col style={{ width: '20%' }} />
    </colgroup>
    <thead>
      <tr>
        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Household ID</th>
        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Cluster</th>
        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Peak Predicted (kWh)</th>
        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Risk Level</th>
      </tr>
    </thead>
    <tbody>
      {filteredRows.map((household, idx) => (
        <tr key={idx}>
          <td className="font-mono" style={{ padding: '13px 12px', borderBottom: '1px solid var(--border)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {household.LCLid}
          </td>
          <td style={{ padding: '13px 12px', borderBottom: '1px solid var(--border)' }}>{household.cluster_id}</td>
          <td className="font-mono" style={{ padding: '13px 12px', borderBottom: '1px solid var(--border)' }}>
            {household.max_prediction.toFixed(3)}
          </td>
          <td style={{ padding: '13px 12px', borderBottom: '1px solid var(--border)' }}>
            <span className={`badge badge-${household.riskColor}`}>
              {household.riskLevel}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {filteredRows.length === 0 && (
          <p className="text-center mt-md">No households match the selected filters.</p>
        )}
      </div>
    </div>
  );
}