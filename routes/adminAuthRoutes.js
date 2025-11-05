const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const { loginAdmin,getStats, getAllVendors , deleteVendor , approveVendor, registerAdmin } = require('../controllers/adminAuthController');
const { getAllUsers, deleteUser } = require('../controllers/adminAuthController');
const Vendor = require('../models/Vendor');


router.post('/login', loginAdmin);
router.get("/stats", getStats);
router.get("/vendors", getAllVendors);
router.delete("/vendor/:id", deleteVendor);
router.put("/vendor/approve/:id", approveVendor);
router.post("/register", registerAdmin);
router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);
router.get("/vendor/:id", authenticateJWT, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vendor" });
  }
});
module.exports = router;
