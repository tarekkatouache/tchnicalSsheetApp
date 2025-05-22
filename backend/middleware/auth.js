const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // OPTIONAL: fetch the user to get additional info like username
    const user = await User.findByPk(decoded.userId);

    // 🟢 Assign user info to req.user — this is the right place
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      username: user ? user.username : null, // useful for audit logs
    };

    next(); // pass to next middleware or route
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
