





const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema(
  {
    about: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      logo: { type: String }, 
      cashOnDelivery: { type: Boolean, default: true },
    },
    contact: {
      address: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      workingHours: { type: String, required: true },
    },
    socialLinks: [
      {
        platform: String, // facebook / instagram / twitter
        url: String,
      },
    ],
     peopleAlsoSearchFor: [String], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Footer", footerSchema);
