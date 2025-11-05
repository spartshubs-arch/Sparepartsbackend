// // const cloudinary = require('cloudinary').v2;

// // cloudinary.config({
// //   cloud_name: process.env.CLOUD_NAME,
// //   api_key: process.env.CLOUD_KEY,
// //   api_secret: process.env.CLOUD_SECRET,
// // });

// // module.exports = cloudinary;




// const cloudinary = require('cloudinary').v2;
// const dotenv = require('dotenv');
// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// module.exports = cloudinary;

// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const dotenv = require('dotenv');

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Set up storage for multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'vendor_slider', 
//     resource_type: 'auto',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//     transformation: [{ width: 500, height: 500, crop: "limit" }],
    
//   },
// });

// const uploadCloud = multer({ storage });

// module.exports = uploadCloud;




// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const dotenv = require('dotenv');

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Set up storage for multer with support for images and videos
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     // Allowed image and video formats
//     const allowedFormats = ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'pdf', 'doc', 'docx'];

//     // Get file extension
//     const extension = file.originalname.split('.').pop().toLowerCase();

//     if (!allowedFormats.includes(extension)) {
//       throw new Error('Unsupported file format');
//     }

//     // For images apply transformation, for videos no transformation
//     const isImage = ['jpg', 'jpeg', 'png'].includes(extension);

//     return {
//       folder: 'vendor_slider',
//       resource_type: isImage ? 'image' : 'video',
//       format: extension, // keep original format
//       transformation: isImage ? [{ width: 500, height: 500, crop: "limit" }] : [],
//     };
//   },
// });

// const uploadCloud = multer({ storage });

// module.exports = uploadCloud;











const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage for multer with support for images, videos, and docs
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Allowed formats
    const allowedFormats = ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'pdf', 'doc', 'docx'];

    // Get file extension
    const extension = file.originalname.split('.').pop().toLowerCase();

    if (!allowedFormats.includes(extension)) {
      throw new Error('Unsupported file format');
    }

    // Type checks
    const isImage = ['jpg', 'jpeg', 'png'].includes(extension);
    const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension);
    const isDoc = ['pdf', 'doc', 'docx'].includes(extension);

    return {
      folder: 'vendor_slider',
      resource_type: isImage ? 'image' : isVideo ? 'video' : 'raw',
      type: 'upload',
      upload_preset: 'ml_default',
       access_mode: 'public', 
      format: extension, // keep original format
      transformation: isImage ? [{ width: 500, height: 500, crop: "limit" }] : [],
    };
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
