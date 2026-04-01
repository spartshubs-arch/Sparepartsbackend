
const express = require("express");
const router  = express.Router();
const {
  loginSuperAdmin,
  getAdminApprovalStats,
  getAllAdmins,
  approveAdmin,
  updateAdminPermissions,
  deleteAdmin,              // ← ADD THIS
} = require("../controllers/superAdminController");
const { authenticateSuperAdmin } = require("../middleware/superAdminAuth");

router.post("/login",                    loginSuperAdmin);
router.get("/admin-stats",               authenticateSuperAdmin, getAdminApprovalStats);
router.get("/admins",                    authenticateSuperAdmin, getAllAdmins);
router.put("/approve-admin/:id",         authenticateSuperAdmin, approveAdmin);
router.put("/update-permissions/:id",    authenticateSuperAdmin, updateAdminPermissions);
router.delete("/delete-admin/:id",       authenticateSuperAdmin, deleteAdmin); // ← ADD THIS

module.exports = router;
