// const express = require('express');
// const router = express.Router();
// const uploadCloud = require('../config/cloudinary');

// const {
//   getSliders,
//   uploadSlider,
//   updateSlider,
//   deleteSlider
// } = require('../controllers/adminSliderController');

// router.get('/sliders', getSliders);
// router.post('/slider',uploadCloud.single('image'), uploadSlider);
// router.put('/slider/:id', uploadCloud.single('image'),updateSlider);
// router.delete('/slider/:id', deleteSlider);



// module.exports = router;



const express = require('express');
const router = express.Router();
const uploadCloud = require('../config/cloudinary');

const {
  getSliders,
  uploadSlider,
  updateSlider,
  deleteSlider,
   getCloudinarySignature
} = require('../controllers/adminSliderController');

router.get('/sliders', getSliders);
router.get("/cloudinary-signature", getCloudinarySignature);
// router.post('/slider',uploadCloud.single('image'), uploadSlider);
// router.put('/slider/:id', uploadCloud.single('image'),updateSlider);
router.post('/slider', uploadSlider);
router.put('/slider/:id', updateSlider);
router.delete('/slider/:id', deleteSlider);





module.exports = router;
