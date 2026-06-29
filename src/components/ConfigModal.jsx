// /**
//  * Configuration Modal Component
//  * Users enter Databricks credentials here
//  */

// import { useState } from 'react';
// import { DATABRICKS_CONFIG } from '../config/databricks.config';
// import '../styles/modal.css';

// export function ConfigModal({ onConfigured }) {
//   const [url, setUrl] = useState('https://dbc-e4ae3b9c-440f.cloud.databricks.com');
//   const [token, setToken] = useState('');
//   const [path, setPath] = useState('/sql/1.0/warehouses/bbe45e7b0f472e08');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!url || !token || !path) {
//       setError('All fields required');
//       return;
//     }

//     setLoading(true);

//     try {
//       DATABRICKS_CONFIG.setConfig(url, token, path);

//       const testRes = await fetch(
//         `${url}/api/2.0/sql/statements`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             sql: 'SELECT 1',
//             warehouse_id: path.split('/').pop()
//           })
//         }
//       );

//       if (!testRes.ok) {
//         throw new Error(`Connection failed (${testRes.status}). Check credentials.`);
//       }

//       onConfigured();
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="config-modal-overlay">
//       <div className="config-modal">
//         <h2>Databricks Configuration</h2>
//         <p className="config-subtitle">Enter your Databricks credentials to load live energy data</p>

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Workspace URL</label>
//             <input
//               type="text"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               placeholder="https://dbc-xxxx.cloud.databricks.com"
//               disabled={loading}
//             />
//           </div>

//           <div className="form-group">
//             <label>Personal Access Token</label>
//             <input
//               type="password"
//               value={token}
//               onChange={(e) => setToken(e.target.value)}
//               placeholder="dapi..."
//               disabled={loading}
//             />
//             <small>Create at: Databricks Settings → Developer → Access tokens</small>
//           </div>

//           <div className="form-group">
//             <label>SQL Warehouse HTTP Path</label>
//             <input
//               type="text"
//               value={path}
//               onChange={(e) => setPath(e.target.value)}
//               placeholder="/sql/1.0/warehouses/..."
//               disabled={loading}
//             />
//           </div>

//           {error && <div className="error-message">❌ {error}</div>}

//           <button type="submit" disabled={loading} className="btn-primary">
//             {loading ? '⏳ Connecting...' : '✓ Connect to Databricks'}
//           </button>
//         </form>

//         <div className="config-info">
//           <h4>Don't have credentials?</h4>
//           <ol>
//             <li>Log into your Databricks workspace</li>
//             <li>Copy workspace URL from address bar</li>
//             <li>Go to Settings → Developer → Generate Access Token</li>
//             <li>Go to SQL Warehouses → Connection details → Copy HTTP Path</li>
//             <li>Paste all three values above</li>
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// }


/**
 * Configuration Modal Component
 * Now only checks backend connection
 */

import { useState } from 'react';
import '../styles/modal.css';

export function ConfigModal({ onConfigured }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test backend connection
      const res = await fetch('http://localhost:5000/health');
      
      if (!res.ok) {
        throw new Error('Backend server not running. Run: npm start (in backend folder)');
      }

      const data = await res.json();
      
      if (!data.configured) {
        throw new Error('Backend: Databricks credentials not configured in .env');
      }

      onConfigured();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="config-modal-overlay">
      <div className="config-modal">
        <h2>Connect to Backend</h2>
        <p className="config-subtitle">Checking backend server connection...</p>

        {error && <div className="error-message">❌ {error}</div>}

        <button 
          className="btn-primary" 
          onClick={handleConnect} 
          disabled={loading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? '⏳ Checking...' : '✓ Connect'}
        </button>

        <div className="config-info">
          <h4>Setup Instructions</h4>
          <ol>
            <li>Open terminal in <code>energyiq-backend</code> folder</li>
            <li>Create <code>.env</code> file with Databricks credentials</li>
            <li>Run: <code>npm install</code></li>
            <li>Run: <code>npm start</code></li>
            <li>Backend runs on <code>http://localhost:5000</code></li>
            <li>Click "Connect" button above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}