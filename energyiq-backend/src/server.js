/**
 * EnergyIQ Backend Proxy
 * Handles Databricks API calls with credentials
 */

const anomaliesRouter = require('./routes/anomalies');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/anomalies', anomaliesRouter);

// Databricks credentials (from .env)
const DATABRICKS_CONFIG = {
  workspaceUrl: process.env.DATABRICKS_HOST,
  token: process.env.DATABRICKS_TOKEN,
  httpPath: process.env.DATABRICKS_HTTP_PATH,

  get warehouseId() {
    return this.httpPath?.split('/').pop();
  }
};

/**
 * POST /api/query
 * Proxy endpoint for Databricks SQL queries
 */
app.post('/api/query', async (req, res) => {
  try {
    const { sql } = req.body;

    if (!sql) {
      return res.status(400).json({ error: 'SQL query required' });
    }

    if (!DATABRICKS_CONFIG.workspaceUrl || !DATABRICKS_CONFIG.token) {
      return res.status(500).json({ error: 'Databricks credentials not configured' });
    }

    console.log(`[Server] Query received: ${sql.substring(0, 80)}...`);

    // ===== STEP 1: SUBMIT QUERY =====
    const submitRes = await fetch(
      `${DATABRICKS_CONFIG.workspaceUrl}/api/2.0/sql/statements`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DATABRICKS_CONFIG.token}`
        },
        body: JSON.stringify({
          statement: sql,
          warehouse_id: DATABRICKS_CONFIG.warehouseId,
          disposition: 'INLINE'
        })
      }
    );

    if (!submitRes.ok) {
      const errorText = await submitRes.text();
      console.error(`[Server] Submit failed: ${submitRes.status}`, errorText);
      return res.status(submitRes.status).json({ error: errorText });
    }

    const submitData = await submitRes.json();
    let state = submitData.status?.state || 'PENDING';
    let resultData = submitData;
    const statementId = submitData.statement_id;
    
    // ===== STEP 2: IF NOT SUCCEEDED YET, POLL FOR COMPLETION =====
    let pollCount = 0;
    const maxPolls = 120;
    
    while (state !== 'SUCCEEDED' && pollCount < maxPolls) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const statusRes = await fetch(
        `${DATABRICKS_CONFIG.workspaceUrl}/api/2.0/sql/statements/${statementId}`,
        {
          headers: {
            'Authorization': `Bearer ${DATABRICKS_CONFIG.token}`
          }
        }
      );

      if (!statusRes.ok) {
        console.error(`[Server] Status check failed: ${statusRes.status}`);
        return res.status(statusRes.status).json({ error: 'Status check failed' });
      }

      resultData = await statusRes.json();
      state = resultData.status?.state || 'FAILED';

      console.log(`[Server] Poll ${pollCount + 1}: ${state}`);

      if (state === 'FAILED' || state === 'CANCELED') {
        const errorMsg = resultData.status?.error?.message || 'Unknown execution error';
        console.error(`[Server] Query ${state}: ${errorMsg}`);
        return res.status(400).json({
          error: `Query ${state}: ${errorMsg}`
        });
      }

      pollCount++;
    }

    if (state !== 'SUCCEEDED') {
      console.error(`[Server] Query timeout`);
      return res.status(504).json({ error: 'Query timeout' });
    }

    // ===== STEP 3: PARSE RESULTS =====
    const resultBlock = resultData.result;
    const manifest = resultData.manifest;
    
    // Extract column headers mapping out of manifest schema array
    const columns = manifest?.schema?.columns?.map(col => col.name) || [];
    
    // Direct execution row payload collection (Bypasses empty chunk flags)
    let rows = [];
    if (resultBlock?.data_array) {
      rows = resultBlock.data_array;
    } else if (resultData.result?.data_array) {
      rows = resultData.result.data_array;
    }

    // Transform row matrices into structured Key-Value JSON objects
    const data = rows.map(row => {
      const obj = {};
      columns.forEach((col, idx) => {
        const value = row[idx];
        
        // Sanitize and handle dynamic parsing for string numbers versus true texts
        if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
          obj[col] = Number(value);
        } else {
          obj[col] = value;
        }
      });
      return obj;
    });

    console.log(`[Server] Success: ${data.length} rows processed`);

    return res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error(`[Server] Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add insights endpoint
app.get('/api/insights', (req, res) => {
  res.json({
    success: true,
    insights: [
      {
        id: '1',
        type: 'trend',
        title: 'Increasing Evening Demand',
        description: 'Energy consumption during 6-9 PM has increased by 12% over the past week',
        value: '+12%',
        confidence: 0.94
      }
    ]
  });
});

app.get('/api/insights/forecast', (req, res) => {
  res.json({
    success: true,
    forecast: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: []
    }
  });
});

app.get('/api/insights/trends', (req, res) => {
  res.json({
    success: true,
    trends: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: []
    }
  });
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    configured: !!(DATABRICKS_CONFIG.workspaceUrl && DATABRICKS_CONFIG.token)
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📊 Databricks: ${DATABRICKS_CONFIG.workspaceUrl}`);
});