import { Router } from "express";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// List with optional status filter
router.get("/", auth, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { user: req.userId, ...(status ? { status } : {}) };
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) { next(e); }
});

// Create
router.post("/", auth, async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({ user: req.userId, title, description, status });
    res.status(201).json(task);
  } catch (e) { next(e); }
});

// Update
router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: { title, description, status } },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (e) { next(e); }
});

// Delete
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findOneAndDelete({ _id: id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;