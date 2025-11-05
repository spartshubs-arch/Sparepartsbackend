const AboutUs = require('../models/AboutUs');

// Get About Us data
exports.getAboutUs = async (req, res) => {
  try {
  let aboutUs = await AboutUs.findOne();
if (!aboutUs) {
  aboutUs = new AboutUs({ topIcons: [], cards: [], faqs: [] });
}

    res.json({ success: true, data: aboutUs });
  } catch (err) {
    console.error("Error fetching About Us:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update About Us data
exports.updateAboutUs = async (req, res) => {
  try {
    let { topIcons, cards, faqs } = req.body;

    // If cards/topIcons/faqs come from multipart/form-data, parse them
    if (typeof cards === "string") {
      try {
        cards = JSON.parse(cards);
      } catch {
        cards = [];
      }
    }
    if (typeof topIcons === "string") {
      try {
        topIcons = JSON.parse(topIcons);
      } catch {
        topIcons = [];
      }
    }
    if (typeof faqs === "string") {
      try {
        faqs = JSON.parse(faqs);
      } catch {
        faqs = [];
      }
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      aboutUs = new AboutUs();
    }

    aboutUs.topIcons = Array.isArray(topIcons) ? topIcons : aboutUs.topIcons;
    aboutUs.faqs = Array.isArray(faqs) ? faqs : aboutUs.faqs;

    if (Array.isArray(cards) && cards.length > 0) {
      aboutUs.cards = cards.map((card, idx) => ({
        ...card,
        imageUrl: images[idx] || card.imageUrl || ''
      }));
    }

    await aboutUs.save();
    res.json({ success: true, data: aboutUs });
  } catch (err) {
    console.error("Error updating About Us:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
