/**
 * Databricks Configuration
 * Users fill these via UI modal
 */

export const DATABRICKS_CONFIG = {
  workspaceUrl: '',
  token: '',
  httpPath: '',
  
  get warehouseId() {
    if (!this.httpPath) return null;
    return this.httpPath.split('/').pop();
  },
  
  isConfigured() {
    return !!(this.workspaceUrl && this.token && this.httpPath);
  },
  
  setConfig(url, token, path) {
    this.workspaceUrl = url;
    this.token = token;
    this.httpPath = path;
    // Persist to localStorage
    localStorage.setItem('dbConfig', JSON.stringify({
      workspaceUrl: url,
      token: token,
      httpPath: path
    }));
  },
  
  loadFromStorage() {
    const stored = localStorage.getItem('dbConfig');
    if (stored) {
      const config = JSON.parse(stored);
      this.workspaceUrl = config.workspaceUrl;
      this.token = config.token;
      this.httpPath = config.httpPath;
      return true;
    }
    return false;
  },
  
  clearConfig() {
    this.workspaceUrl = '';
    this.token = '';
    this.httpPath = '';
    localStorage.removeItem('dbConfig');
  }
};