import express from "express";
import db from "../database_client.js";

const router = express.Router();

// GET /api/meals - Return all meals
router.get("/", async (req, res) => {
  try {
    const meals = await db("meal").select("*");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals/:id - Get meal by ID
router.get("/:id", async (req, res) => {
  try {
    const meal = await db("meal").where({ id: req.params.id }).first();
    if (!meal) return res.status(404).json({ error: "Meal not found" });
    res.json(meal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/meals - Create new meal
router.post("/", async (req, res) => {
  try {
    const [id] = await db("meal").insert(req.body);
    const newMeal = await db("meal").where({ id }).first();
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/meals/:id - Update meal
router.put("/:id", async (req, res) => {
  try {
    const updated = await db("meal")
      .where({ id: req.params.id })
      .update(req.body);
    if (!updated) return res.status(404).json({ error: "Meal not found" });
    const updatedMeal = await db("meal").where({ id: req.params.id }).first();
    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/meals/:id - Delete meal
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db("meal").where({ id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ error: "Meal not found" });
    res.json({ message: "Meal deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
