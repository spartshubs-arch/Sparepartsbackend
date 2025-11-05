const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

//ADD Product
exports.addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    console.log("📦 Images received:", req.files.length);
    console.log("Vendor ID:", req.body.vendorId);

    // CloudinaryStorage automatically adds the file.path as secure_url
    const urls = req.files.map(file => file.path);

    const newProduct = new Product({
      ...req.body,
      images: urls,
      vendorId: req.body.vendorId
    });

    await newProduct.save();

    res.status(201).json({ success: true, product: newProduct });

  } catch (err) {
    console.error("🔥 Server error:", err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};



// View All Products
exports.getAllVendorProducts = async (req, res) => {
  const vendorId = req.query.vendorId; 
  try {
    const products = await Product.find({ vendorId }).sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

//edit product AB 
exports.editProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const isAdmin = req.body.isAdmin === true || req.body.isAdmin === "true"; // ✅ detect admin

    const updated = await Product.findByIdAndUpdate(productId, req.body, { new: true });

    // ✅ Only admins trigger watermark creation
    if (isAdmin && updated.images && updated.images.length > 0) {
      const watermarkedImages = updated.images.map((url) => {
        const [base, rest] = url.split("/upload/");
        return `${base}/upload/l_sparepartslogo_juyvv1,o_60,w_200,g_south_east,x_10,y_10/${rest}`;
      });

      updated.watermarkedImages = watermarkedImages;
      await updated.save();
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: 'Error updating product' });
  }
};
// Delete Product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await Product.findByIdAndDelete(productId);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Error deleting product' });
  }
};
// GET /products/all-adminAB 

// exports.getAllProductsForAdmin = async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// };
exports.getAllProductsForAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("vendorId", "idNumber") // ✅ Only fetch vendor's idNumber
      .lean(); // optional but makes it faster

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products for admin:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

