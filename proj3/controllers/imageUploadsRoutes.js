const express = require('express');
const router = express.Router();
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer')
const user = require('../models/userSchema')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })


router.post('/uploadprofilePic', upload.single('myImage'), async (req, res) => {
    const file = req.file;
    const { userId } = req.body;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const existingUser = await user.findById(userId);
    if (!existingUser) {
        return res.status(400).json({ error: "No user found" })
    }

    cloudinary.uploader.upload_stream({
        resource_type: "auto"
    },
        async (error, result) => {
            if (error) {
                return res.status(400).json({ error: "Failed to upload image" })
            }

            existingUser.profilePic = result.secure_url;

            await existingUser.save();

            res.json({ imageUrl: result.url, message: "Profile picture uploaded succesfully" })
        }
    ).end(file.buffer);



})