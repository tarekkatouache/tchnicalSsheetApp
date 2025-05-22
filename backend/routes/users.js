// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const authenticateToken = require("../middleware/auth");
// // const authorizeRole = require("../middleware/authorizeRole"); // custom middleware to check admin role

// // ✅ Get all users (Admin only)
// router.get("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
//   try {
//     const users = await User.findAll({
//       attributes: { exclude: ["password"] },
//     });
//     res.json(users);
//   } catch (error) {
//     console.error("Failed to fetch users:", error);
//     res.status(500).json({
//       message: "Server error while fetching users.",
//       error: error.message,
//     });
//   }
// });

// // ✅ Get own profile
// router.get("/me", authenticateToken, async (req, res) => {
//   const user = await User.findByPk(req.user.userId, {
//     attributes: { exclude: ["password"] },
//   });
//   res.json(user);
// });

// router.put("/profile", async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     // console.log("Received body:", req.body);

//     const { name, lastName, jobTitle, service, email, image } = req.body;

//     // Find the user first
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Update allowed fields only
//     user.name = name ?? user.name;
//     user.lastName = lastName ?? user.lastName;
//     user.jobTitle = jobTitle ?? user.jobTitle;
//     user.service = service ?? user.service;
//     user.email = email ?? user.email;
//     user.image = image ?? user.image;

//     await user.save();

//     // Return updated user without password
//     const updatedUser = await User.findByPk(userId, {
//       attributes: { exclude: ["password"] },
//     });

//     res.json({ message: "Profile updated successfully", user: updatedUser });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ message: "Server error updating profile." });
//   }
// });

// // update role (Admin only)
// // PUT /api/users/:id/role
// router.put(
//   "/users/:id/role",
//   authenticateToken,
//   authorizeRole("admin"), // only admin can change roles
//   async (req, res) => {
//     try {
//       const { role } = req.body;
//       const userIdToChange = req.params.id;

//       // 🟡 Step 1: Find the target user
//       const targetUser = await User.findByPk(userIdToChange);
//       if (!targetUser) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const oldRole = targetUser.role;

//       // 🟡 Step 2: Update the role
//       targetUser.role = role;
//       await targetUser.save();

//       // 🟡 Step 3: Log the change
//       await logAction({
//         userId: req.user.userId, // the admin who made the change
//         action: "UPDATE_ROLE",
//         entity: "User",
//         entityId: targetUser.id,
//         description: `User ${req.user.username} changed role of user ${targetUser.username} from ${oldRole} to ${role}`,
//       });

//       res.json({ message: "User role updated successfully", targetUser });
//     } catch (error) {
//       console.error("Error updating role:", error);
//       res.status(500).json({ error: error.message });
//     }
//   }
// );

// module.exports = router;
