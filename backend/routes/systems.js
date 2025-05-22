const express = require("express");
const System = require("../models/System");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole"); // custom middleware to check admin role
const logAction = require("../utils/logAction");
const AuditLog = require("../models/AuditLog");

const router = express.Router();

// Create new system (protected)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    const system = await System.create({ name, description });

    /////
    console.log(req.user); // Add this just before the AuditLog.create line

    await AuditLog.create({
      userId: req.user.id, // user performing the action (from JWT)
      action: "CREATE",
      userLogged: req.user.username,
      entity: "System",
      entityId: system.id,
      description: `System created with ${system.name}by ${req.user.name} ${req.user.lastName}`,
    });
    ////
    res.status(201).json(system);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all systems  (Admin and User)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const systems = await System.findAll();
    await AuditLog.create({
      userId: req.user.id, // user performing the action (from JWT)
      action: "READ",
      userLogged: req.user.username,
      entity: "System",
      entityId: systems.id,
      description: `Systems are called by ${req.user.name} ${req.user.lastName}`,
    });
    res.json(systems);
  } catch (error) {
    console.error("Error fetching systems:", error);
    res.status(500).json({ message: "Server error while fetching systems." });
  }
});

// PUT /api/systems/:id - Update a system (Admin only)
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const systemId = req.params.id;
      const { name, description } = req.body;

      const system = await System.findByPk(systemId);

      if (!system) {
        return res.status(404).json({ message: "System not found." });
      }

      // Update values
      system.name = name || system.name;
      system.description = description || system.description;

      await system.save();
      await AuditLog.create({
        userId: req.user.id, // user performing the action (from JWT)
        action: "UPDATE",
        userLogged: req.user.username,
        entity: "System",
        entityId: system.id,
        description: `System  ${system.name} Updated by ${req.user.name} ${req.user.lastName}`,
      });

      res.json({ message: "System updated successfully", system });
    } catch (error) {
      console.error("Error updating system:", error);
      res.status(500).json({ message: "Server error while updating system." });
    }
  }
);

// DELETE /api/systems/:id - Delete a system (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const system = await System.findByPk(req.params.id);
      if (!system) {
        return res.status(404).json({ message: "System not found" });
      }

      await system.destroy({
        where: { id: req.params.id },
      });
      await AuditLog.create({
        userId: req.user.id, // user performing the action (from JWT)
        action: "DELETE",
        userLogged: req.user.username,
        entity: "System",
        entityId: system.id,
        description: `System  ${system.name} Deleted by ${req.user.name} ${req.user.lastName}`,
      });
      res.json({ message: "System deleted successfully" });
    } catch (error) {
      console.error("Error deleting system:", error);
      res.status(500).json({ message: "Server error while deleting system" });
    }
  }
);

module.exports = router;
