const mongoose = require('mongoose');

const carDetailsSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  variant: { type: String, required: true },
  bodyType: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('CarDetails', carDetailsSchema);
