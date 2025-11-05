const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  ProductName: String,
  ProductNo: String,
  unit: String,
  price: Number,
  salePrice: Number,
  carParts: String,
  side: String,
  make: String,
  model: String,
    year: { 
    type: Number, 
    required: true 
  },
  stock: Number,
  images: [String],
  watermarkedImages: [String], 
  description: String,
  brand: String,
  size: String,
  status: { type: String, default: 'pending' },// pending, approved, sold
   condition: { 
    type: String, 
    enum: ['new', 'used'], 
    required: true 
  },

   vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
