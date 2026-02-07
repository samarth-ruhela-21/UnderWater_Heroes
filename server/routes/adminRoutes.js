// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const UserReport = require('../models/UserReport');

// GET /api/admin/jobs - Simulation script checks this
router.get('/jobs', async (req, res) => {
  try {
    // Find verified pollution reports that haven't been cleaned
    const jobs = await UserReport.find({ 
      status: 'Pending', 
      'aiResult.isPolluted': true 
    });
    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// POST /api/admin/dispatch - Admin clicks button on Dashboard
router.post('/dispatch', async (req, res) => {
  try {
    const { reportId } = req.body;
    
    // Mark as 'In Progress' so the Drone Script knows to pick it up
    const updated = await UserReport.findByIdAndUpdate(reportId, {
      status: 'Cleaning In Progress'
    }, { new: true });

    if (!updated) {
        return res.status(404).json({ error: "Job not found" });
    }

    res.json({ success: true, job: updated });
  } catch (err) {
    console.error("❌ Error dispatching drone:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// POST /api/admin/complete - Drone Script calls this when finished
router.post('/complete', async (req, res) => {
  try {
    const { reportId } = req.body;
    await UserReport.findByIdAndUpdate(reportId, { status: 'Resolved' });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error completing job:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;