// const jwt = require("jsonwebtoken");
// const Admin = require("../models/Admin");

// exports.loginSuperAdmin = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (username !== "abdullah" || password !== "2399") {
//       return res.status(401).json({ message: "Invalid super admin credentials" });
//     }

//     const token = jwt.sign(
//       { role: "superadmin", username: "abdullah" },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       message: "Super admin login successful",
//       token,
//       superAdmin: {
//         username: "abdullah",
//       },
//     });
//   } catch (error) {
//     console.error("Super admin login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getAdminApprovalStats = async (req, res) => {
//   try {
//     const totalAdmins = await Admin.countDocuments();
//     const approvedAdmins = await Admin.countDocuments({ isApproved: true });
//     const pendingAdmins = await Admin.countDocuments({ isApproved: false });
//     const remainingSlots = 15 - totalAdmins;

//     res.json({
//       totalAdmins,
//       remainingSlots,
//       approvedAdmins,
//       pendingAdmins,
//     });
//   } catch (error) {
//     console.error("Error fetching admin stats:", error);
//     res.status(500).json({ message: "Failed to fetch admin stats" });
//   }
// };

// exports.getAllAdmins = async (req, res) => {
//   try {
//     const admins = await Admin.find().sort({ createdAt: -1 });
//     res.json(admins);
//   } catch (error) {
//     console.error("Error fetching admins:", error);
//     res.status(500).json({ message: "Failed to fetch admins" });
//   }
// };

// exports.approveAdmin = async (req, res) => {
//   try {
//     const admin = await Admin.findByIdAndUpdate(
//       req.params.id,
//       { isApproved: true },
//       { new: true }
//     );

//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     res.json({ message: "✅ Admin approved successfully", admin });
//   } catch (error) {
//     console.error("Error approving admin:", error);
//     res.status(500).json({ message: "Approval failed" });
//   }
// };


// controllers/superAdminController.js

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// ─── Login ────────────────────────────────────────────────────────────────────
exports.loginSuperAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== "Imdadullah Orakzai" || password !== "spareparts@#?<<!!!$&??3711") {
      return res.status(401).json({ message: "Invalid super admin credentials" });
    }

    const token = jwt.sign(
      { role: "superadmin", username: "Imdadullah Orakzai" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Super admin login successful", token, superAdmin: { username: "abdullah" } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Stats ────────────────────────────────────────────────────────────────────
exports.getAdminApprovalStats = async (req, res) => {
  try {
    const totalAdmins   = await Admin.countDocuments();
    const approvedAdmins = await Admin.countDocuments({ isApproved: true });
    const pendingAdmins  = await Admin.countDocuments({ isApproved: false });
    const remainingSlots = 15 - totalAdmins;

    res.json({ totalAdmins, remainingSlots, approvedAdmins, pendingAdmins });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// ─── All Admins ───────────────────────────────────────────────────────────────
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

// ─── Approve + set permissions ────────────────────────────────────────────────
exports.approveAdmin = async (req, res) => {
  try {
    const { accessType = "all", allowedPages = [] } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true,
        accessType,
        allowedPages: accessType === "selected" ? allowedPages : [],
      },
      { new: true }
    );

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin approved successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
};

// ─── Update permissions (already-approved admin) ──────────────────────────────
exports.updateAdminPermissions = async (req, res) => {
  try {
    const { accessType = "all", allowedPages = [] } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        accessType,
        allowedPages: accessType === "selected" ? allowedPages : [],
      },
      { new: true }
    );

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Permissions updated successfully", admin });
  } catch (error) {
    res.status(500).json({ message: "Failed to update permissions" });
  }
};

// ─── Admin fetches their own permissions ──────────────────────────────────────
exports.getMyPermissions = async (req, res) => {
  try {
    // req.adminId must be set by your existing authenticateAdmin middleware
    const admin = await Admin.findById(req.adminId).select("accessType allowedPages");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
};

// superAdminController.js — ADD AT THE BOTTOM

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "✅ Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "❌ Failed to delete admin" });
  }
};
