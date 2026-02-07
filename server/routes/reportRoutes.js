const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiService = require('../services/aiService');
const UserReport = require('../models/UserReport');

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/reports/upload - User takes a photo
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No image uploaded');

    // 1. Send to Python AI
    const aiData = await aiService.analyzeImage(req.file.buffer, req.file.originalname);

    // 2. Save Report
    const report = new UserReport({
      imageUrl: "https://via.placeholder.com/300", // In production, upload to Cloudinary here
      location: JSON.parse(req.body.location || '{"lat":0, "lng":0}'),
      aiResult: aiData
    });

    await report.save();
    res.json({ success: true, report });

  } catch (err) {
    console.error(err);
    res.status(500).send('Processing Failed');
  }
});

module.exports = router;