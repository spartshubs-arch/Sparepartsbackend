const Footer = require("../models/Footer");

// Get footer content
exports.getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create({
        about: { title: "", description: "" },
        contact: { address: "", email: "", phone: "", workingHours: "" },
        socialLinks: []
      });
    }
    res.json(footer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update footer
exports.updateFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create(req.body);
    } else {
      footer.set(req.body);
      await footer.save();
    }
    res.json(footer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
