const Slider = require('../models/HomeSlider');

// Get filter by sliders
// exports.getSliders = async (req, res) => {
//   try {
//     const { type } = req.query;

//     const filter = type ? { type } : {};
//     const sliders = await Slider.find(filter).sort({ createdAt: -1 });

//     res.json(sliders);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch sliders" });
//   }
// };

exports.getSliders = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = type ? { type } : {};
    const sliders = await Slider.find(filter).sort({ createdAt: -1 });

    res.json(sliders); // imageUrl field contains Cloudinary URL
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sliders" });
  }
};




// // Update  slider
// exports.updateSlider = async (req, res) => {
//   try {
//     const { title, subtitle, type } = req.body;
//     const updateData = { title, subtitle, type };

//     if (req.file) {
//       updateData.imageUrl = `/uploads/${req.file.filename}`;
//     }

//     const slider = await Slider.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!slider) return res.status(404).json({ message: "Slider not found" });

//     res.json(slider);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Update failed" });
//   }
// };

// // Upload slider
// exports.uploadSlider = async (req, res) => {
//   try {
//     const { title, subtitle, type } = req.body;

//     if (!req.file) return res.status(400).json({ message: "Image is required." });

//     const imageUrl = `/uploads/${req.file.filename}`;

//     const count = await Slider.countDocuments({ type }); // ✅ only count same type
//     if (type === "slider" && count >= 5) {
//       return res.status(400).json({ message: "Maximum 5 sliders allowed." });
//     }
//     if (type === "category" && count >= 10) {
//       return res.status(400).json({ message: "Maximum 10 category banners allowed." });
//     }

//     const slider = new Slider({ imageUrl, title, subtitle, type }); // ✅ include type
//     await slider.save();

//     res.status(201).json(slider);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload failed" });
//   }
// };

// Upload slider
exports.uploadSlider = async (req, res) => {
  try {
    const { title, subtitle, type } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image is required." });
    }

    const imageUrl = req.file.path; // this is the cloudinary URL

    // Count check per type
    const count = await Slider.countDocuments({ type });
    if (type === "slider" && count >= 8) {
      return res.status(400).json({ message: "Maximum 8 sliders allowed." });
    }
    if (type === "category" && count >= 5) {
      return res.status(400).json({ message: "Maximum 5 category banners allowed." });
    }

    const slider = new Slider({ imageUrl, title, subtitle, type });
    await slider.save();

    res.status(201).json(slider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// Update slider
exports.updateSlider = async (req, res) => {
  try {
    const { title, subtitle, type } = req.body;
    const updateData = { title, subtitle, type };

    if (req.file && req.file.path) {
      updateData.imageUrl = req.file.path; // new Cloudinary image URL
    }

    const slider = await Slider.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!slider) return res.status(404).json({ message: "Slider not found" });

    res.json(slider);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};


// Delete slider
exports.deleteSlider = async (req, res) => {
  try {
    const deleted = await Slider.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Slider not found" });
    res.json({ message: "Slider deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
