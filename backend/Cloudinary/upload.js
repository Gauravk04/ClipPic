// const express = require("express");
// const bodyParser = require("body-parser");
// const cloudinary = require("cloudinary").v2;
// const cors = require("cors");
// require("dotenv").config();

// const router = express.Router();

// const app = express();
// const port = process.env.PORT || 4000;

// app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );
// app.use(bodyParser.urlencoded({ extended: true }));

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Define the route for uploading images to Cloudinary
// app.post("/upload", async (req, res) => {
//   try {
//     const imageData = req.body.file; // Image data obtained from FormData

//     // Upload image data to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload(imageData, {
//       upload_preset: "ml_default", // Set your Cloudinary upload preset here
//     });

//     res.json(uploadResult); // Send the upload result back to the client
//   } catch (error) {
//     console.error("Error uploading image to Cloudinary:", error);
//     res.status(500).json({ error: "Error uploading image to Cloudinary" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

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
