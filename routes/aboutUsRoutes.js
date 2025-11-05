const express = require('express');
const router = express.Router();
const { getAboutUs, updateAboutUs } = require('../controllers/aboutUsController');
const uploadCloud = require('../config/cloudinary');

// Middleware for admin auth
const requireAdmin = (req, res, next) => { /* TODO: check admin */ next(); };

router.get('/', getAboutUs);

router.put(
  '/',
  requireAdmin,
  uploadCloud.array('cardImages', 3), // max 3 card images
  updateAboutUs
);

module.exports = router;
