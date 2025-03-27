const express = require("express");
const User = require("../models/User"); // Adjust the path to your model
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Harryisagoodb$oy"; // Replace with a secure secret key

// Create a User using: POST "/api/auth/createuser"
router.post(
  "/createuser",
  [
    // Validate and sanitize the 'name' field
    body("name", "Enter a valid name (at least 3 characters)").isLength({
      min: 3,
    }),

    // Validate and sanitize the 'email' field
    body("email", "Enter a valid email").isEmail(),

    // Validate the 'password' field
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // Check if the user already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Email already exists." });
      }

      // Create a new user instance
      user = new User(req.body);

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      // Save the user to the database
      await user.save();

      // Generate JWT payload
      const payload = {
        user: {
          id: user.id, // Use the user's unique ID from the database
        },
      };

      // Sign the JWT
      const authtoken = jwt.sign(payload, JWT_SECRET);

      // Send the response with the JWT
      success = true;
      res.status(201).json({ success, authtoken });
    } catch (error) {
      console.error("Error:", error);

      // Handle duplicate key error (email already exists)
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists." });
      }

      // Handle validation errors (e.g., missing required fields)
      if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
      }

      // Handle other errors
      res
        .status(500)
        .json({ error: "An error occurred while creating the user." });
    }
  }
);

// Authenticate a User using: POST "/api/auth/login"

router.post(
  "/login",
  [
    // Validate and sanitize the 'email' field
    body("email", "Enter a valid email").isEmail(),

    // Validate the 'password' field
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials." });
      }

      // Compare the provided password with the hashed password in the database
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({ success, error: "Invalid credentials." });
      }

      // Generate JWT payload
      const payload = {
        user: {
          id: user.id, // Use the user's unique ID from the database
        },
      };

      // Sign the JWT
      const authtoken = jwt.sign(payload, JWT_SECRET);

      // Send the response with the JWT
      success = true;
      res.status(200).json({ success, authtoken });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get login  User using: POST "/api/auth/getuser"

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    // Check if the user exists
    userId = req.user.id;
    let user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
