// /**
//  * Sidebar Navigation Component
//  */

// import '../styles/layout.css';

// export function Sidebar({ currentPage, onPageChange, onReconfigure }) {
//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <div className="logo">
//           <span className="logo-dot">●</span>
//           <h1>EnergyIQ</h1>
//         </div>
//         <p className="logo-sub">Smart Meter Network</p>
//       </div>

//       <nav className="sidebar-nav">
//         <div className="nav-section">Pages</div>
        
//         <button
//           className={`nav-item ${currentPage === 'overview' ? 'active' : ''}`}
//           onClick={() => onPageChange('overview')}
//         >
//           <span className="nav-icon">📊</span>
//           Overview
//         </button>

//         <button
//           className={`nav-item ${currentPage === 'alerts' ? 'active' : ''}`}
//           onClick={() => onPageChange('alerts')}
//         >
//           <span className="nav-icon">⚠️</span>
//           Alerts
//         </button>

//         <button
//           className={`nav-item ${currentPage === 'cluster' ? 'active' : ''}`}
//           onClick={() => onPageChange('cluster')}
//         >
//           <span className="nav-icon">🎯</span>
//           Cluster Analysis
//         </button>

//         <button
//           className={`nav-item ${currentPage === 'metrics' ? 'active' : ''}`}
//           onClick={() => onPageChange('metrics')}
//         >
//           <span className="nav-icon">📈</span>
//           Model Metrics
//         </button>
//       </nav>

//       <div className="sidebar-footer">
//         <button className="btn-reconfigure" onClick={onReconfigure}>
//           ⚙️ Reconfigure
//         </button>
//         <p className="connection-status">
//           <span className="status-dot">●</span>
//           Connected
//         </p>
//       </div>
//     </div>
//   );
// }

/**
 * Sidebar Navigation Component
 * Premium Modern Redesign
 */

import { BarChart3, AlertTriangle, Crosshair, LineChart, Settings, Activity } from 'lucide-react';
import '../styles/layout.css';

export function Sidebar({ currentPage, onPageChange, onReconfigure }) {
  return (
    <div className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon-wrapper">
            <Activity size={16} className="logo-icon" />
          </div>
          <h1>EnergyIQ</h1>
        </div>
        <p className="logo-sub">Smart Meter Network</p>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-section">Navigation</div>
        
        <button
          className={`nav-item ${currentPage === 'overview' ? 'active' : ''}`}
          onClick={() => onPageChange('overview')}
        >
          <BarChart3 size={18} className="nav-icon" />
          <span className="nav-text">Overview</span>
        </button>

        <button
          className={`nav-item ${currentPage === 'alerts' ? 'active' : ''}`}
          onClick={() => onPageChange('alerts')}
        >
          <AlertTriangle size={18} className="nav-icon" />
          <span className="nav-text">Alerts</span>
        </button>

        <button
          className={`nav-item ${currentPage === 'cluster' ? 'active' : ''}`}
          onClick={() => onPageChange('cluster')}
        >
          <Crosshair size={18} className="nav-icon" />
          <span className="nav-text">Cluster Analysis</span>
        </button>

        <button
          className={`nav-item ${currentPage === 'metrics' ? 'active' : ''}`}
          onClick={() => onPageChange('metrics')}
        >
          <LineChart size={18} className="nav-icon" />
          <span className="nav-text">Model Metrics</span>
        </button>
      </nav>

      {/* Footer & Status Actions */}
      <div className="sidebar-footer">
        <button className="btn-reconfigure" onClick={onReconfigure}>
          <Settings size={16} className="btn-icon" />
          <span>Reconfigure</span>
        </button>
        
        <div className="connection-status online">
          <span className="status-dot"></span>
          <span className="status-text">System Live</span>
        </div>
      </div>
    </div>
  );
}