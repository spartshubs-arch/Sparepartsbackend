const express = require("express");
const Blog = require("../models/Blog");
const router = express.Router();

// Create Blog (FAST: Cloudinary already done on frontend)
router.post("/", async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required." });
    }

    const blog = new Blog({
      title,
      content,
      image: imageUrl, // store Cloudinary secure_url
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get One Blog by ID — needed by the new BlogDetailPage ("Read More" page)
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    // Invalid ObjectId format also lands here — treat as not-found
    // rather than a 500, since it's really a bad/old URL, not a server error.
    res.status(404).json({ message: "Blog not found" });
  }
});

// Delete Blog
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
