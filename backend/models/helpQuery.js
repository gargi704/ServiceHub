const mongoose = require('mongoose');

const helpQuerySchema = new mongoose.Schema({
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HelpQuery', helpQuerySchema);
