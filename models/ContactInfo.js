const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  name: String,     // e.g. "facebook"
  icon: String,     // simple letter or icon name (frontend displays it)
  link: String,
});

const contactInfoSchema = new mongoose.Schema({
  title: { type: String, default: 'Get In Touch' },
  bannerImage: { type: String, default: '' },           // Cloudinary URL
  contactInfoBackground: { type: String, default: '' }, // Cloudinary URL
  description: { type: String, default: '' },
  address: { type: String, default: '' },
  phones: { type: [String], default: [] },
  emails: { type: [String], default: [] },
  socials: { type: [socialSchema], default: [] },
  formDescription: { type: String, default: '' },
  mapEmbedUrl: { type: String, default: '' }, // full google maps embed URL
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
