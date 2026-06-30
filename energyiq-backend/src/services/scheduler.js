const cron = require('node-cron');

class ReportScheduler {
  constructor() {
    this.jobs = new Map();
  }

  start() {
    console.log('📅 Report scheduler started');
    // Check for pending reports every minute
    cron.schedule('* * * * *', () => {
      this.runScheduledReports();
    });
  }

  addJob(id, schedule, callback) {
    // Convert schedule to cron expression
    const [hours, minutes] = schedule.split(':').map(Number);
    const cronExpr = `${minutes} ${hours} * * *`;
    
    const job = cron.schedule(cronExpr, callback);
    this.jobs.set(id, job);
  }

  removeJob(id) {
    if (this.jobs.has(id)) {
      this.jobs.get(id).stop();
      this.jobs.delete(id);
    }
  }

  async runScheduledReports() {
    console.log('🔍 Checking for scheduled reports...');
    // Implementation would check due reports and execute them
  }
}

module.exports = new ReportScheduler();