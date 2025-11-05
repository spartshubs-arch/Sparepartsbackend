const mongoose = require('mongoose');

// const vendorSchema = new mongoose.Schema({
//   idNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     length: 15
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   contact: {
//     type: String,
//     required: true
//   },
//   address: {
//     type: String,
//     required: true
//   },
//   firstName: {
//     type: String,
//     required: true
//   },
//   lastName: {
//     type: String,
//     required: true
//   },
//   city: {
//     type: String,
//     required: true
//   },
//   area: {
//     type: String,
//     required: true
//   },
//   idCardImage: {
//   type: String, 
//   required: true
// },

//    isApproved: { type: Boolean, default: false }
// }, { timestamps: true });

// module.exports = mongoose.model('Vendor', vendorSchema);






const vendorSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true, length: 15 },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
 

  // ✅ UAE Requirements
  tradeName: String,
  licenseNumber: String,
  trnNumber: String,
  businessType: String,
  licenseImage: String,
  passportImage: String,

  isApproved: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Vendor', vendorSchema);