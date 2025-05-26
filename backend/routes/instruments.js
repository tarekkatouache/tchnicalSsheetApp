const express = require("express");
const Instrument = require("../models/Instrument");
const authenticateToken = require("../middleware/auth");
const logAction = require("../utils/logAction");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// CREATE: Add new instrument
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description, location, systemId } = req.body;
    const updatedByUserId = req.user.userId;

    const instrument = await Instrument.create({
      name,
      description,
      location,
      systemId,
      updatedByUserId,
    });

    res.status(201).json(instrument);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "Instrument name must be unique per system." });
    }
    res.status(500).json({ error: err.message });
  }
});

// READ: Get all instruments (optional system filter) // without  permission
router.get("/", async (req, res) => {
  try {
    const { systemId } = req.query;

    const where = systemId ? { systemId } : {};
    const instruments = await Instrument.findAll({ where });

    res.json(instruments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Update instrument
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Get instrument ID from request parameters
    const { name, description, location, systemId } = req.body;

    const instrument = await Instrument.findByPk(id);
    if (!instrument)
      return res.status(404).json({ message: "Instrument not found" });

    instrument.name = name;
    instrument.description = description;
    instrument.location = location;
    instrument.systemId = systemId;
    instrument.updatedByUserId = req.user.userId;

    await instrument.save();
    res.json(instrument);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove instrument
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const instrument = await Instrument.findByPk(id);
      if (!instrument)
        return res.status(404).json({ message: "Instrument not found" });

      await instrument.destroy({
        where: { id: req.params.id },
      });
      res.json({ message: "Instrument deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
