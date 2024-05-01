const express = require("express");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/upload", async (req, res) => {
  console.log("inside upload");
  try {
    const imageData = req.body.file;
    console.log(imageData);

    const uploadResult = await cloudinary.uploader.upload(imageData, {
      upload_preset: "ml_default",
    });

    res.json(uploadResult);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
});

module.exports = router;
