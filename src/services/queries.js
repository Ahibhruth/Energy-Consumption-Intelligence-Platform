export const SQL = {
  // ===== OVERVIEW PAGE =====
  
  modelMetrics: `
    SELECT model, rmse, mae FROM workspace.default.model_metrics
  `,

  householdsByCluster: `
    SELECT cluster, COUNT(*) as count 
    FROM workspace.default.household_cluster_mapping 
    WHERE cluster >= 0 
    GROUP BY cluster
    ORDER BY cluster
  `,

  sampleHouseholdTimeSeries: `
    SELECT DateTime, energy, prediction, cluster_id
    FROM workspace.default.energy_predictions
    WHERE LCLid = 'MAC005271' AND cluster_id != -99
    ORDER BY DateTime DESC
    LIMIT 48
  `,

  peakDemandHours: `
    SELECT HOUR(DateTime) as hour, AVG(prediction) as avg_demand
    FROM workspace.default.energy_predictions
    WHERE cluster_id != -99
    GROUP BY hour
    ORDER BY avg_demand DESC
    LIMIT 5
  `,

  totalPredictions: `
    SELECT COUNT(*) as total FROM workspace.default.energy_predictions WHERE cluster_id != -99
  `,

  currentDemandByCluster: `
    SELECT cluster_id, SUM(prediction) as total_kwh, COUNT(*) as readings
    FROM workspace.default.energy_predictions
    WHERE cluster_id != -99
    GROUP BY cluster_id
    ORDER BY cluster_id
  `,

  // ===== ALERTS PAGE =====

  topRiskHouseholds: `
    SELECT LCLid, cluster_id, MAX(prediction) as max_prediction
    FROM workspace.default.energy_predictions
    WHERE cluster_id != -99
    GROUP BY LCLid, cluster_id
    ORDER BY max_prediction DESC
    LIMIT 5000
  `,

  riskDistribution: `
    WITH HouseholdMaxPredictions AS (
      SELECT LCLid, MAX(prediction) as max_pred
      FROM workspace.default.energy_predictions
      WHERE cluster_id != -99
      GROUP BY LCLid
    )
    SELECT 
      CASE WHEN max_pred > 2.0 THEN 'High'
           WHEN max_pred > 1.0 THEN 'Medium'
           WHEN max_pred > 0.5 THEN 'Low'
           ELSE 'Safe' END as risk_level,
      COUNT(*) as count
    FROM HouseholdMaxPredictions
    GROUP BY risk_level
  `,

  // ===== CLUSTER ANALYSIS PAGE =====

  cluster0TimeSeries: `
    SELECT DateTime, AVG(prediction) as avg_prediction, COUNT(*) as households
    FROM workspace.default.energy_predictions
    WHERE cluster_id = 0
    GROUP BY DateTime
    ORDER BY DateTime
    LIMIT 100
  `,

  cluster1TimeSeries: `
    SELECT DateTime, AVG(prediction) as avg_prediction, COUNT(*) as households
    FROM workspace.default.energy_predictions
    WHERE cluster_id = 1
    GROUP BY DateTime
    ORDER BY DateTime
    LIMIT 100
  `,

  globalTimeSeries: `
    SELECT DateTime, AVG(prediction) as avg_prediction, COUNT(*) as households
    FROM workspace.default.energy_predictions
    WHERE cluster_id = -99
    GROUP BY DateTime
    ORDER BY DateTime
    LIMIT 100
  `,

  // ===== MODEL METRICS PAGE =====

  allMetrics: `
    SELECT model, rmse, mae FROM workspace.default.model_metrics
  `,
  // ===== ANOMALY DETECTION PAGE =====

//   anomalySampleData: `
//   SELECT DateTime, LCLid, cluster_id, prediction
//   FROM workspace.default.energy_predictions
//   WHERE cluster_id != -99
//   ORDER BY RAND()
//   LIMIT 2000
// `,
anomalySampleData: `
  WITH RankedReadings AS (
    SELECT DateTime, LCLid, cluster_id, prediction,
           ROW_NUMBER() OVER (PARTITION BY LCLid ORDER BY DateTime DESC) as rn
    FROM workspace.default.energy_predictions
    WHERE cluster_id != -99
  )
  SELECT DateTime, LCLid, cluster_id, prediction
  FROM RankedReadings
  WHERE rn <= 20
  ORDER BY LCLid, DateTime
  LIMIT 2000
`,
};