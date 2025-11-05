// routes/faqRoutes.js
const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// Get all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/faqs  - Admin: create FAQ
router.post('/', async (req, res) => {
  try {
    const faq = new FAQ({
      question: req.body.question,
      answer: req.body.answer,
    });
    await faq.save();
    res.json({ success: true, faq });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

// PUT /api/faqs/:id - Admin: edit FAQ
router.put('/:id', async (req, res) => {
  try {
    const updated = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, faq: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// DELETE /api/faqs/:id - Admin: delete FAQ
router.delete('/:id', async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

module.exports = router;
