/**
 * Main App Component
 * Handles routing, state, configuration
 */

import { useState, useEffect } from 'react';
import { DATABRICKS_CONFIG } from './config/databricks.config';
import { ConfigModal } from './components/ConfigModal';
import { Sidebar } from './components/Sidebar';

import { AnomalyDetectionPage } from './pages/AnomalyDetectionPage';

// Removed unused Topbar from here because OverviewPage renders its own Topbar internally

// ── FIXED IMPORT SYNTAX ──────────────────────────────────────────────
// Ensuring named import matches "export function OverviewPage()" exactly
import { OverviewPage } from './pages/OverviewPage'; 
import { AlertsPage } from './pages/AlertsPage';
import { ClusterAnalysisPage } from './pages/ClusterAnalysisPage';
import { ModelMetricsPage } from './pages/ModelMetricsPage';
import './styles/index.css';

function App() {
  const [configured, setConfigured] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');

  useEffect(() => {
    // Try to load stored credentials
    const loadedConfig = DATABRICKS_CONFIG.loadFromStorage();
    setConfigured(loadedConfig);
  }, []);

  const handleConfigured = () => {
    setConfigured(true);
  };

  const handleReconfigure = () => {
    DATABRICKS_CONFIG.clearConfig();
    setConfigured(false);
  };

  if (!configured) {
    return <ConfigModal onConfigured={handleConfigured} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onReconfigure={handleReconfigure}
      />

      <div className="main-content">
        {currentPage === 'overview' && <OverviewPage />}
        {currentPage === 'alerts' && <AlertsPage />}
        {currentPage === 'cluster' && <ClusterAnalysisPage />}
        {currentPage === 'metrics' && <ModelMetricsPage />}
        
        {currentPage === 'anomalies' && <AnomalyDetectionPage />}
        
      </div>
    </div>
  );
}

export default App;