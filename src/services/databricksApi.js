// /**
//  * Databricks SQL API Client
//  * Handles query submission, polling, result retrieval
//  */

// import { DATABRICKS_CONFIG } from '../config/databricks.config';

// export async function queryDatabricks(sql) {
//   if (!DATABRICKS_CONFIG.isConfigured()) {
//     throw new Error('Databricks not configured. Enter credentials first.');
//   }

//   try {
//     console.log(`[DB] Executing: ${sql.substring(0, 80)}...`);

//     // ===== STEP 1: SUBMIT QUERY =====
//     const submitRes = await fetch(
//       `${DATABRICKS_CONFIG.workspaceUrl}/api/2.0/sql/statements`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${DATABRICKS_CONFIG.token}`
//         },
//         body: JSON.stringify({
//           sql: sql,
//           warehouse_id: DATABRICKS_CONFIG.warehouseId,
//           disposition: 'EXTERNAL_LINKS'
//         })
//       }
//     );

//     if (!submitRes.ok) {
//       const errorText = await submitRes.text();
//       throw new Error(`Submit failed (${submitRes.status}): ${errorText}`);
//     }

//     const submitData = await submitRes.json();
//     const statementId = submitData.statement_id;
//     console.log(`[DB] Query submitted. ID: ${statementId}`);

//     // ===== STEP 2: POLL FOR COMPLETION =====
//     let state = 'PENDING';
//     let pollCount = 0;
//     const maxPolls = 120;

//     while (state !== 'SUCCEEDED' && pollCount < maxPolls) {
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       const statusRes = await fetch(
//         `${DATABRICKS_CONFIG.workspaceUrl}/api/2.0/sql/statements/${statementId}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${DATABRICKS_CONFIG.token}`
//           }
//         }
//       );

//       if (!statusRes.ok) {
//         throw new Error(`Status check failed (${statusRes.status})`);
//       }

//       const statusData = await statusRes.json();
//       state = statusData.state;

//       console.log(`[DB] Poll ${pollCount + 1}: ${state}`);

//       if (state === 'FAILED' || state === 'CANCELED') {
//         const errorMsg = statusData.error_message || 'Unknown error';
//         throw new Error(`Query ${state}: ${errorMsg}`);
//       }

//       pollCount++;
//     }

//     if (state !== 'SUCCEEDED') {
//       throw new Error(`Query timeout after ${maxPolls} seconds`);
//     }

//     // ===== STEP 3: FETCH RESULTS =====
//     const resultRes = await fetch(
//       `${DATABRICKS_CONFIG.workspaceUrl}/api/2.0/sql/statements/${statementId}/result/chunks/0`,
//       {
//         headers: {
//           'Authorization': `Bearer ${DATABRICKS_CONFIG.token}`
//         }
//       }
//     );

//     if (!resultRes.ok) {
//       throw new Error(`Result fetch failed (${resultRes.status})`);
//     }

//     const result = await resultRes.json();
//     const rows = result.rows || [];
//     const columns = result.manifest.schema.columns.map(col => col.name);

//     console.log(`[DB] Success: ${rows.length} rows, ${columns.length} columns`);

//     // Convert array rows to objects
//     const data = rows.map(row => {
//       const obj = {};
//       columns.forEach((col, idx) => {
//         obj[col] = row[idx];
//       });
//       return obj;
//     });

//     return data;
//   } catch (err) {
//     console.error(`[DB] Error:`, err.message);
//     throw err;
//   }
// }

// /**
//  * Batch query (multiple queries in parallel)
//  */
// export async function queryDatabricksBatch(sqlArray) {
//   const promises = sqlArray.map(sql => queryDatabricks(sql));
//   return Promise.all(promises);
// }

/**
 * Databricks API Client (via Backend Proxy)
 * Calls backend server instead of Databricks directly
 */

const API_URL = 'http://localhost:5000/api/query';

export async function queryDatabricks(sql) {
  try {
    console.log(`[Frontend] Query: ${sql.substring(0, 80)}...`);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    const result = await res.json();
    console.log(`[Frontend] Success: ${result.data.length} rows`);
    
    return result.data;
  } catch (err) {
    console.error(`[Frontend] Error:`, err.message);
    throw err;
  }
}

export async function queryDatabricksBatch(sqlArray) {
  const promises = sqlArray.map(sql => queryDatabricks(sql));
  return Promise.all(promises);
}