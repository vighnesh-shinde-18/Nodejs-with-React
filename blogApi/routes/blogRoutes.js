const express = require('express');
const Blog = require('../models/blogSchema');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Blog
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newBlog = new Blog({ title, content, author: req.user.id });

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get User's Blogs
router.get('/my-blogs', authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
