// routes/helpCenterRoutes.js
const express = require("express");
const router = express.Router();
const HelpCenter = require("../models/HelpCenter");

// ✅ Get Help Center Content (for users)
router.get("/", async (req, res) => {
  try {
    const content = await HelpCenter.findOne(); // only one doc
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Admin: Update Help Center
router.put("/update", async (req, res) => {
  try {
    const { title, description, requestCallback, contactUs, quickTip } = req.body;
    let content = await HelpCenter.findOne();

    if (!content) {
      content = new HelpCenter({ title, description, requestCallback, contactUs, quickTip });
    } else {
      content.title = title;
      content.description = description;
      content.requestCallback = requestCallback;
      content.contactUs = contactUs;
      content.quickTip = quickTip;
    }

    await content.save();
    res.json({ message: "Help Center updated", content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
