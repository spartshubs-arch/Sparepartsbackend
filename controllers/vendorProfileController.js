// controllers/vendorProfileController.js
const Vendor = require('../models/Vendor');

function isProfileComplete(vendor) {
  return vendor.firstName && vendor.lastName && vendor.contact && vendor.address &&
         vendor.city && vendor.area && vendor.idCardImage &&
         vendor.tradeLicenseNumber && vendor.tradeLicenseImage &&
         vendor.emiratesIdImage && vendor.bank?.iban;
}

exports.getProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).select("-password");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    const files = req.files || {};
    if (files.idCardImage) updates.idCardImage = files.idCardImage[0].path;
    if (files.tradeLicenseImage) updates.tradeLicenseImage = files.tradeLicenseImage[0].path;
    if (files.establishmentCardImage) updates.establishmentCardImage = files.establishmentCardImage[0].path;
    if (files.emiratesIdImage) updates.emiratesIdImage = files.emiratesIdImage[0].path;
    if (files.passportImage) updates.passportImage = files.passportImage[0].path;
    if (files.vatCertImage) updates.vatCertImage = files.vatCertImage[0].path;

    if (updates.bank && typeof updates.bank === 'string') {
      updates.bank = JSON.parse(updates.bank);
    }

    let vendor = await Vendor.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    vendor.profileCompleted = isProfileComplete(vendor);
    await vendor.save();

    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
