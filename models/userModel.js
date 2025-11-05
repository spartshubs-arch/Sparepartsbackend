const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: { type: String, default: null },
  isSocialLogin: { type: Boolean, default: false }
});


module.exports = mongoose.model('User', userSchema);
