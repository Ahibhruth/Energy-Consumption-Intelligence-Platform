/**
 * Formatting Utilities
 * Number and date formatting helpers
 */

export function formatNumber(num, decimals = 2) {
  return parseFloat(num).toFixed(decimals);
}

export function formatCurrency(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
}

export function formatPercent(num, decimals = 1) {
  return `${parseFloat(num).toFixed(decimals)}%`;
}

export function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getHourFromDateTime(dateStr) {
  return new Date(dateStr).getHours();
}

export function abbreviateNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toFixed(0);
}