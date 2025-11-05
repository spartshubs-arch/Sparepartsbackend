const ContactMessage = require('../models/ContactMessage');
const mongoose = require('mongoose');

exports.saveMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const doc = await ContactMessage.create({ name, email, phone, subject, message });
    // optionally: send notification email here
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const msgs = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: msgs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid message ID' });
    }

    const deleted = await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};