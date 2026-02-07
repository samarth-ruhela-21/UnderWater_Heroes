const mongoose = require('mongoose');

const BuoyLogSchema = new mongoose.Schema({
  stationId: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number,
    region: String // "Mumbai Port"
  },
  timestamp: { type: Date, default: Date.now },
  
  // Sensors
  ph: Number,
  turbidity: Number,
  temp: Number,
  
  // Computed
  ohiScore: Number,
  status: { type: String, enum: ['Excellent', 'Good', 'Critical'], default: 'Good' }
});

module.exports = mongoose.model('BuoyLog', BuoyLogSchema);