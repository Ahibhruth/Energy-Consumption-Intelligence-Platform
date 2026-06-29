// /**
//  * App Constants
//  * Colors, thresholds, configuration
//  */

// export const COLORS = {
//   blue: '#4a90e8',
//   amber: '#f0a030',
//   red: '#e84a4a',
//   green: '#3acc80',
//   purple: '#9b72e8',
//   dark: '#0d0f14',
//   surface: '#141720',
//   text: '#e8eaf0',
//   textDim: '#9098b8'
// };

// export const RISK_THRESHOLDS = {
//   high: 2.0,
//   medium: 1.0,
//   low: 0.5
// };

// export const RISK_LEVELS = {
//   high: { label: 'High', color: COLORS.red, bgColor: '#4a1e1e' },
//   medium: { label: 'Medium', color: COLORS.amber, bgColor: '#4a3010' },
//   low: { label: 'Low', color: COLORS.amber, bgColor: '#4a3010' },
//   safe: { label: 'Safe', color: COLORS.green, bgColor: '#1a3a28' }
// };

// export const CHART_COLORS = {
//   cluster0: COLORS.blue,
//   cluster1: COLORS.amber,
//   global: COLORS.red,
//   actual: COLORS.green,
//   predicted: COLORS.blue
// };

// export const API_CONFIG = {
//   QUERY_TIMEOUT_MS: 120000, // 2 minutes
//   POLL_INTERVAL_MS: 1000,   // 1 second
//   MAX_RETRIES: 3
// };

// export const PAGE_INFO = {
//   overview: {
//     title: 'City Demand Overview',
//     subtitle: 'Aggregate forecast · London Smart Meters · 5,446 households'
//   },
//   alerts: {
//     title: 'Risk Alerts',
//     subtitle: 'High-risk households · Demand response protocol'
//   },
//   cluster: {
//     title: 'Cluster Deep-Dive Analysis',
//     subtitle: 'Model-specific demand profiles · 48-hour forecast'
//   },
//   metrics: {
//     title: 'Model Performance Metrics',
//     subtitle: 'Accuracy comparison · RMSE & MAE analysis'
//   }
// };

/**
 * App Constants
 * Colors, thresholds, configuration
 */

export const COLORS = {
  blue: '#2dd4bf',
  amber: '#e8954a',
  red: '#ef5350',
  green: '#3ddc91',
  purple: '#8b8fe8',
  dark: '#0a1115',
  surface: '#0f1820',
  text: '#eef4f3',
  textDim: '#8ba3ab'
};

export const RISK_THRESHOLDS = {
  high: 2.0,
  medium: 1.0,
  low: 0.5
};

export const RISK_LEVELS = {
  high: { label: 'High', color: COLORS.red, bgColor: '#3d1a1a' },
  medium: { label: 'Medium', color: COLORS.amber, bgColor: '#3d2814' },
  low: { label: 'Low', color: COLORS.amber, bgColor: '#3d2814' },
  safe: { label: 'Safe', color: COLORS.green, bgColor: '#123424' }
};

export const CHART_COLORS = {
  cluster0: COLORS.blue,
  cluster1: COLORS.amber,
  global: COLORS.red,
  actual: COLORS.green,
  predicted: COLORS.blue
};

export const API_CONFIG = {
  QUERY_TIMEOUT_MS: 120000, // 2 minutes
  POLL_INTERVAL_MS: 1000,   // 1 second
  MAX_RETRIES: 3
};

export const PAGE_INFO = {
  overview: {
    title: 'Demand Overview',
    subtitle: 'Aggregate forecast · Smart Meter Network · 5,446 households'
  },
  alerts: {
    title: 'Risk Alerts',
    subtitle: 'High-risk households · Demand response protocol'
  },
  cluster: {
    title: 'Cluster Deep-Dive Analysis',
    subtitle: 'Model-specific demand profiles · 48-hour forecast'
  },
  metrics: {
    title: 'Model Performance Metrics',
    subtitle: 'Accuracy comparison · RMSE & MAE analysis'
  }
};