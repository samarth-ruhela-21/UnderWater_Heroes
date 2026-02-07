// server/models/Authority.js
const mongoose = require('mongoose'); // <--- MISSING IMPORT

const AuthoritySchema = new mongoose.Schema({
  region: String,         // e.g., "Yamuna River Zone"
  email: String,          // Official Govt Email
  phone: String,
  assignedBuoys: [String] // List of Station IDs they manage
});

module.exports = mongoose.model('Authority', AuthoritySchema); // <--- MISSING EXPORT