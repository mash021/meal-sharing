import express from "express";
import db from "../database_client.js";

const router = express.Router();

// GET /api/reservations - Get all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await db("reservation").select("*");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reservations/:id - Get reservation by ID
router.get("/:id", async (req, res) => {
  try {
    const reservation = await db("reservation")
      .where({ id: req.params.id })
      .first();
    if (!reservation)
      return res.status(404).json({ error: "Reservation not found" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reservations - Create new reservation
router.post("/", async (req, res) => {
  try {
    const [id] = await db("reservation").insert(req.body);
    const newReservation = await db("reservation").where({ id }).first();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reservations/:id - Update reservation
router.put("/:id", async (req, res) => {
  try {
    const updated = await db("reservation")
      .where({ id: req.params.id })
      .update(req.body);
    if (!updated)
      return res.status(404).json({ error: "Reservation not found" });
    const updatedReservation = await db("reservation")
      .where({ id: req.params.id })
      .first();
    res.json(updatedReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reservations/:id - Delete reservation
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await db("reservation").where({ id: req.params.id }).del();
    if (!deleted)
      return res.status(404).json({ error: "Reservation not found" });
    res.json({ message: "Reservation deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
