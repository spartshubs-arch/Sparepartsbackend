const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
