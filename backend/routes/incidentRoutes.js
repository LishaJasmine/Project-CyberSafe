import express from "express";
import mongoose from "mongoose";
import Incident from "../models/Incident.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 }).lean();
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: "Could not load incidents." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, type, description } = req.body ?? {};
    if (![name, email, type, description].every(v => typeof v === "string" && v.trim())) {
      return res.status(400).json({ message: "Please complete every field." });
    }
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    const incident = await Incident.create({
      name: name.trim(), email: normalizedEmail, type, description: description.trim()
    });
    res.status(201).json(incident);
  } catch (error) {
    if (error?.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Could not save the report." });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid incident ID." });
    const { status } = req.body ?? {};
    if (!["Pending", "Under Review", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    const incident = await Incident.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!incident) return res.status(404).json({ message: "Incident not found." });
    res.json(incident);
  } catch {
    res.status(500).json({ message: "Could not update incident status." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid incident ID." });
    const incident = await Incident.findByIdAndDelete(req.params.id);
    if (!incident) return res.status(404).json({ message: "Incident not found." });
    res.json({ message: "Incident deleted." });
  } catch {
    res.status(500).json({ message: "Could not delete incident." });
  }
});

export default router;
