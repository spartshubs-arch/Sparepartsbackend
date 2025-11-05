const express = require('express');
const router = express.Router();
const { getContactInfo, saveContactInfo } = require('../controllers/contactController');
const { saveMessage, getMessages, deleteMessage } = require('../controllers/messageController');
const uploadCloud = require('../config/cloudinary'); // your multer/cloudinary config
// protect middleware placeholder
const requireAdmin = (req, res, next) => { /* TODO: admin auth */ next(); };

// Public: get contact info
router.get('/', getContactInfo);

// Public: save a contact message from the site
router.post('/message', saveMessage);

// Admin: update contact info (images upload)
router.post(
  '/',
  requireAdmin, // add real auth in production
  uploadCloud.fields([
    { name: 'bannerImage', maxCount: 1 },
    { name: 'contactInfoBackground', maxCount: 1 },
  ]),
  saveContactInfo
);

// Admin: get messages
router.get('/messages', requireAdmin, getMessages);
router.delete('/messages/:id', requireAdmin, deleteMessage);


module.exports = router;
