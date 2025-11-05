// const express = require('express');
// const router = express.Router();
// const uploadCloud = require('../config/cloudinary');  
// const { registerVendor, loginVendor, getVendorProfile } = require('../controllers/vendorAuthController');

// router.post('/register', uploadCloud.single('idCardImage'), registerVendor);
// router.post('/login', loginVendor);
// // ✅ profile fetch (no password returned)
// router.get('/:id', getVendorProfile);

// module.exports = router;
// routes/vendorRoutes.js



// routes/vendorRoutes.js
const express = require('express');
const router = express.Router();
const uploadCloud = require('../config/cloudinary');
const {
  registerVendor,
  loginVendor,
  getVendorProfile,
  updateVendorProfile
} = require('../controllers/vendorAuthController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// ✅ Vendor Registration
router.post('/register', registerVendor);

// ✅ Vendor Login
router.post('/login', loginVendor);

// ✅ Vendor Profile (fetch own profile)
router.get('/profile', authenticateJWT, getVendorProfile);

// ✅ Vendor Profile Update (upload license + passport)
router.put(
  '/profile',
  authenticateJWT,
  uploadCloud.fields([
    { name: 'licenseFile', maxCount: 1 },
    { name: 'passportFile', maxCount: 1 }
  ]),
  updateVendorProfile
);


module.exports = router;
