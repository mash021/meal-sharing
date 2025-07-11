import express from "express";
import db from "../database_client.js";
import { z } from "zod";

const router = express.Router();

// Zod schema for reservation
const reservationSchema = z.object({
  number_of_guests: z.number().int().positive(),
  meal_id: z.number().int().positive(),
  created_date: z.string().min(1), // Should be ISO date string
  contact_phone_number: z.string().min(1),
  contact_name: z.string().min(1),
  contact_email: z.string().email(),
});

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
    const parseResult = reservationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const [id] = await db("reservation").insert(parseResult.data);
    const newReservation = await db("reservation").where({ id }).first();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reservations/:id - Update reservation
router.put("/:id", async (req, res) => {
  try {
    const parseResult = reservationSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const updated = await db("reservation")
      .where({ id: req.params.id })
      .update(parseResult.data);
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
