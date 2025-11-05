const express = require('express');
const router = express.Router();
const { addCarDetails, getAllCarDetails, deleteCarDetail } = require('../controllers/carDetailsController');

router.post('/add', addCarDetails);  // You can later add auth middleware if needed
router.get('/all', getAllCarDetails);
router.delete('/delete/:id', deleteCarDetail);

module.exports = router;
