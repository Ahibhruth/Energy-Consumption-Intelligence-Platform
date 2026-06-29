/**
 * Chart.js Configuration Presets
 * Reusable chart options
 */

import { COLORS } from './constants';

export const chartOptions = {
  line: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: COLORS.textDim,
          font: { size: 12 },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: COLORS.surface,
        titleColor: COLORS.text,
        bodyColor: COLORS.textDim,
        borderColor: COLORS.textDim,
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        ticks: {
          color: COLORS.textDim,
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        }
      },
      y: {
        ticks: {
          color: COLORS.textDim,
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        }
      }
    }
  },
  
  bar: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: COLORS.textDim,
          font: { size: 12 },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: COLORS.surface,
        titleColor: COLORS.text,
        bodyColor: COLORS.textDim,
        borderColor: COLORS.textDim,
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: {
        ticks: {
          color: COLORS.textDim,
          font: { size: 11 }
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: COLORS.textDim,
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        }
      }
    }
  },

  doughnut: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: COLORS.textDim,
          font: { size: 12 },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: COLORS.surface,
        titleColor: COLORS.text,
        bodyColor: COLORS.textDim,
        borderColor: COLORS.textDim,
        borderWidth: 1,
        padding: 12
      }
    }
  }
};