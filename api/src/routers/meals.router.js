import express from "express";
import db from "../database_client.js";

const router = express.Router();

// GET /future-meals
router.get("/future-meals", async (req, res) => {
  try {
    const meals = await db("meal").where("when", ">", new Date());
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
