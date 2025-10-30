const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  experience: String,
  hourlyRate: String,
  skills: String,
  rating: { type: Number, default: 0 },
  description: String,
  location: String,
  profileImage: { type: String, default: "" },
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  totalJobs: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  idProof: [{ type: String }],  
  certificates: [{ type: String }], 
  workPhotos: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);
