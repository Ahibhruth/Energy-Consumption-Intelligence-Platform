const express = require('express');
const router = express.Router();

// In-memory storage for anomalies
let anomalies = [
  {
    id: '1',
    type: 'unusual_consumption',
    severity: 'high',
    LCLid: 'MAC005271',
    cluster_id: 0,
    detectedAt: new Date().toISOString(),
    description: 'Unusual energy consumption detected',
    value: 3.2,
    expected: 1.8,
    threshold: 0.5,
    acknowledged: false
  },
  {
    id: '2',
    type: 'consumption_spike',
    severity: 'critical',
    LCLid: 'MAC004532',
    cluster_id: 1,
    detectedAt: new Date(Date.now() - 3600000).toISOString(),
    description: 'Sudden consumption spike detected',
    value: 4.5,
    expected: 2.1,
    threshold: 3.15,
    acknowledged: false
  }
];

router.get('/', async (req, res) => {
  try {
    const { filter } = req.query;
    let filtered = [...anomalies];
    
    if (filter === 'unacknowledged') {
      filtered = filtered.filter(a => !a.acknowledged);
    } else if (filter && filter !== 'all') {
      filtered = filtered.filter(a => a.severity === filter);
    }
    
    res.json({ success: true, anomalies: filtered });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const total = anomalies.length;
    const unacknowledged = anomalies.filter(a => !a.acknowledged).length;
    const critical = anomalies.filter(a => a.severity === 'critical').length;
    const today = anomalies.filter(a => {
      const date = new Date(a.detectedAt);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }).length;
    
    res.json({
      success: true,
      stats: { total, unacknowledged, critical, today }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/acknowledge', async (req, res) => {
  try {
    const anomaly = anomalies.find(a => a.id === req.params.id);
    if (anomaly) {
      anomaly.acknowledged = true;
      anomaly.acknowledgedAt = new Date().toISOString();
    }
    res.json({ success: true, anomaly });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;