import express from "express";
import db from "../database_client.js";

const router = express.Router();

// GET /api/reviews - Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await db("review").select("*");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals/:meal_id/reviews - Get all reviews for a specific meal
router.get("/meals/:meal_id/reviews", async (req, res) => {
  try {
    const reviews = await db("review")
      .where({ meal_id: req.params.meal_id })
      .select("*");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews - Create a new review
router.post("/", async (req, res) => {
  try {
    const [id] = await db("review").insert(req.body);
    const newReview = await db("review").where({ id }).first();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reviews/:id - Get a review by ID
router.get("/:id", async (req, res) => {
  try {
    const review = await db("review").where({ id: req.params.id }).first();
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reviews/:id - Update a review
router.put("/:id", async (req, res) => {
  try {
    const updated = await db("review")
      .where({ id: req.params.id })
      .update(req.body);
    if (!updated) return res.status(404).json({ error: "Review not found" });
    const updatedReview = await db("review")
      .where({ id: req.params.id })
      .first();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete a review
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db("review").where({ id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
