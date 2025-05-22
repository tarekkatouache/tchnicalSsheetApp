const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole"); // custom middleware to check admin role
const AuditLog = require("../models/AuditLog");

// ✅ Get all users (Admin only)
router.get("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    await AuditLog.create({
      userId: req.user.id, // user performing the action (from JWT)
      action: "CREATE",
      userLogged: req.user.username,
      entity: "User",
      entityId: 99999,
      description: `all Users called by ${req.user.name} ${req.user.lastName}`,
    });
    res.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);

    res.status(500).json({
      message: "Server error while fetching users.",
      error: error.message,
    });
  }
});

// ✅ Get own profile
router.get("/me", authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: { exclude: ["password"] },
  });
  AuditLog.create({
    userId: req.user.userId, // user performing the action (from JWT)
    action: "READ",
    userLogged: req.user.username,
    entity: "User",
    entityId: user.id,
    description: `User ${req.user.username} ${req.user.lastName} fetched their profile`,
  });
  res.json(user);
});
// ✅ Update own profile http://localhost:5000/api/users/profile
//$$$$$$$$ TO DO $$$$$$$$$$ it doesn't work yet
// PUT /api/users/profile
// router.put("/profile", a  uthenticateToken, async (req, res) => {
//   try {
//     console.log("REQ.BODY:", req.body);

//     const { name } = req.body;
//     // const userId = req.user.id;

//     const user = await User.findByPk(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     user.name = name;
//     // user.lastName = lastName;

//     await user.save();
//     res.json({ message: "Profile updated successfully", user });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ message: "Server error updating profile." });
//   }
// });

// update role (Admin only)
// PUT /api/users/:id/role
router.put(
  "/users/:id/role",
  authenticateToken,
  authorizeRole("admin"), // only admin can change roles
  async (req, res) => {
    try {
      const { role } = req.body;
      const userIdToChange = req.params.id;

      // 🟡 Step 1: Find the target user
      const targetUser = await User.findByPk(userIdToChange);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const oldRole = targetUser.role;

      // 🟡 Step 2: Update the role
      targetUser.role = role;
      await targetUser.save();

      // 🟡 Step 3: Log the change
      await logAction({
        userId: req.user.userId, // user performing the action (from JWT)
        action: "READ",
        userLogged: req.user.username,
        entity: "User",
        entityId: user.id,
        description: `User ${req.user.username} changed role of user ${targetUser.username} from ${oldRole} to ${role}`,
      });

      res.json({ message: "User role updated successfully", targetUser });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
