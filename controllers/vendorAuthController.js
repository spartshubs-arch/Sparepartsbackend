const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.registerVendor = async (req, res) => {
  try {
    const { idNumber, password, ...rest } = req.body;
        
    if (idNumber.length !== 15) {
      return res.status(400).json({ message: "ID must be exactly 15 digits." });
    }

    const existing = await Vendor.findOne({ idNumber });
    if (existing) return res.status(409).json({ message: "Vendor ID already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = new Vendor({
      idNumber,
      password: hashedPassword,
      ...rest
    });

    await vendor.save();

    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN
// exports.loginVendor = async (req, res) => {
//   try {
//     const { idNumber, password } = req.body;

//     const vendor = await Vendor.findOne({ idNumber });
//     if (!vendor) return res.status(404).json({ message: "Vendor not found" });

//     const isMatch = await bcrypt.compare(password, vendor.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ vendorId: vendor._id }, "your_jwt_secret", { expiresIn: "1d" });

//     res.status(200).json({
//       token,
//       vendor: {
//         id: vendor._id,
//         idNumber: vendor.idNumber,
//         firstName: vendor.firstName,
//         lastName: vendor.lastName
//       }
//     });
//   } catch {
//     res.status(500).json({ message: "Login failed" });
//   }
// };



// // LOGIN
// exports.loginVendor = async (req, res) => {
//   try {
//     const { idNumber, password } = req.body;

//     const vendor = await Vendor.findOne({ idNumber });
//     if (!vendor) return res.status(404).json({ message: "Vendor not found" });

//     const isMatch = await bcrypt.compare(password, vendor.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     // ✅ Check approval
//     if (!vendor.isApproved) {
//       return res.status(403).json({ message: "Your account is not approved by admin yet." });
//     }

//     const token = jwt.sign({ vendorId: vendor._id }, "your_jwt_secret", { expiresIn: "1d" });

//     res.status(200).json({
//       token,
//       vendor: {
//         id: vendor._id,
//         idNumber: vendor.idNumber,
//         firstName: vendor.firstName,
//         lastName: vendor.lastName
//       }
//     });
//   } catch {
//     res.status(500).json({ message: "Login failed" });
//   }
// };

// LOGIN (simple, no approval restriction, no isApproved in response)
exports.loginVendor = async (req, res) => {
  try {
    const { idNumber, password } = req.body;

    const vendor = await Vendor.findOne({ idNumber });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 🚫 Approval check removed (vendor can log in regardless of isApproved)

    const token = jwt.sign(
      { vendorId: vendor._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      vendor: {
        id: vendor._id,
        idNumber: vendor.idNumber,
        firstName: vendor.firstName,
        lastName: vendor.lastName
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// controllers/vendorAuthController.js
exports.getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendorId; // from token
    const vendor = await Vendor.findById(vendorId).select("-password");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.json(vendor);
  } catch (err) {
    console.error("Error fetching vendor profile:", err);
    res.status(500).json({ message: "Failed to fetch vendor profile" });
  }
};

// ✅ Update own profile
exports.updateVendorProfile = async (req, res) => {
  try {
    const vendorId = req.vendorId; // from token
    const updateData = { ...req.body };

    if (req.files) {
      if (req.files.licenseFile) updateData.licenseImage = req.files.licenseFile[0].path;
      if (req.files.passportFile) updateData.passportImage = req.files.passportFile[0].path;
    }

    const vendor = await Vendor.findByIdAndUpdate(vendorId, updateData, { new: true })
      .select("-password");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.json({ message: "Profile updated successfully", vendor });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};