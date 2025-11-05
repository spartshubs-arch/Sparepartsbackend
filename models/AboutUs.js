const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  topIcons: [
    {
      title: String,
      icon: String, // Emoji or icon class name
      description: String,
    }
  ],
  cards: [
    {
      title: String,
      description: String,
      imageUrl: String,
    }
  ],
  faqs: [
    {
      question: String,
      answer: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('AboutUs', aboutUsSchema);
