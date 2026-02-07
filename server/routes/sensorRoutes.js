// server/routes/sensorRoutes.js
const express = require('express');
const router = express.Router();
const BuoyLog = require('../models/BuoyLog');
const calculateOHI = require('../services/ohiCalculator');
const emailService = require('../services/emailService'); 

// POST /api/sensors/data - Called by Simulation Script
router.post('/data', async (req, res) => {
  try {
    // We expect 'location' to have { lat, lng, region }
    const { stationId, location, ph, turbidity, temp } = req.body;

    // 1. Calculate Health Index
    const ohiScore = calculateOHI(ph, turbidity, temp);

    // 2. Determine Status
    let status = 'Good';
    if (ohiScore < 50) status = 'Critical';
    if (ohiScore > 80) status = 'Excellent';

    // 3. Trigger Alert if Critical (NOW ENABLED!)
    if (status === 'Critical') {
      console.log(`⚠️ CRITICAL ALERT: Station ${stationId} (OHI: ${ohiScore})`);
      
      // Send email to the Judge (Change the email string to your own if testing)
      // Arguments: (stationId, ohiScore, regionName, recipientEmail)
      const regionName = location.region || "Unknown Zone";
      await emailService.sendAlert(stationId, ohiScore, regionName, "your-email@gmail.com"); 
    }

    // 4. Save to DB
    const log = new BuoyLog({ stationId, location, ph, turbidity, temp, ohiScore, status });
    await log.save();

    res.json({ success: true, status, ohiScore });
  } catch (err) {
    console.error("❌ Sensor Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/sensors/live-map - For Dashboard Map
router.get('/live-map', async (req, res) => {
  try {
    // Returns the LATEST reading for every unique buoy
    const logs = await BuoyLog.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$stationId", doc: { $first: "$$ROOT" } } }
    ]);
    res.json(logs.map(l => l.doc));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;