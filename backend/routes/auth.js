const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const logAction = require("../utils/logAction");

const router = express.Router(); // create a new router instance
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // secret key for JWT signing

// Register; // POST /api/auth/register http://localhost:5000/api/auth/register
router.post("/register", async (req, res) => {
  //
  try {
    const { name, lastName, jobTitle, service, username, password, email } =
      req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      lastName,
      jobTitle,
      service,
      username,
      password: hashedPassword,
      email,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login //post /   http://localhost:5000/api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      {
        // id: user.id,
        // email: user.email,
        // role: user.role,

        userId: user.id,
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },

      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
    // console.log("login successful", user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
