const mongoose = require('mongoose');

const homeSliderSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  type: {
    type: String,
    enum: ['slider', 'category'], 
    required: true,
    default: 'slider'
  }
}, { timestamps: true });

module.exports = mongoose.model('HomeSlider', homeSliderSchema);
