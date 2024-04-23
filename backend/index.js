const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const uploadRouter = require("./Cloudinary/upload");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow the specified HTTP methods
    credentials: true, // Allow cookies and HTTP authentication to be sent with the request
  })
);

// Database connection with MongoDB
mongoose.connect(
  "mongodb+srv://gaurav:123@cluster0.3pfekll.mongodb.net/clippic"
);

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Schema creating for user model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Endpoint for registering the user
app.post("/signup", async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        error: "existing user found with same email address",
      });
    }
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, "secret_ecom");
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint for user login
app.post("/login", async (req, res) => {
  try {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      const passCompare = req.body.password === user.password;
      if (passCompare) {
        const data = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(data, "secret_ecom");
        res.json({ success: true, token });
      } else {
        res.json({ success: false, error: "Wrong Password" });
      }
    } else {
      res.json({ success: false, error: "Wrong Email Address" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mount the upload router at '/cloudinary/upload'
app.use("/cloudinary", uploadRouter);

// Listen for connections
app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port " + port);
  } else {
    console.log("Error: " + error);
  }
});
