const mongoose = require('mongoose');

const UserReportSchema = new mongoose.Schema({
  imageUrl: String, // URL or Base64
  location: { lat: Number, lng: Number },
  createdAt: { type: Date, default: Date.now },
  
  aiResult: {
    plasticCount: Number,
    isPolluted: Boolean,
    details: Array // [{"object": "bottle", "confidence": 0.9}]
  },
  
  // Admin Workflow
  status: { type: String, default: 'Pending' }, // Pending -> Cleaning -> Resolved
  actionLog: String
});

module.exports = mongoose.model('UserReport', UserReportSchema);