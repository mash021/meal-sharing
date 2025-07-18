import express from "express";
import db from "../database_client.js";
import { z } from "zod";

const router = express.Router();

// Zod schema for meal
const mealSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  when: z.string().min(1), // Should be ISO date string
  max_reservations: z.number().int().positive(),
  price: z.number().positive(),
  created_date: z.string().min(1), // Should be ISO date string
});

// GET /api/meals - Return all meals with query parameters
router.get("/", async (req, res) => {
  try {
    const {
      maxPrice,
      availableReservations,
      title,
      dateAfter,
      dateBefore,
      limit,
      sortKey,
      sortDir,
    } = req.query;

    let query = db("meal").select("*");

    // Apply filters
    if (maxPrice) {
      query = query.where("price", "<=", Number(maxPrice));
    }

    if (title) {
      query = query.where("title", "like", `%${title}%`);
    }

    if (dateAfter) {
      query = query.where("when", ">", dateAfter);
    }

    if (dateBefore) {
      query = query.where("when", "<", dateBefore);
    }

    if (availableReservations !== undefined) {
      const subquery = db("meal")
        .leftJoin("reservation", "meal.id", "reservation.meal_id")
        .groupBy("meal.id")
        .select("meal.id")
        .havingRaw("meal.max_reservations > COUNT(reservation.id)");

      if (availableReservations === "true") {
        query = query.whereIn("id", subquery);
      } else {
        query = query.whereNotIn("id", subquery);
      }
    }

    // Apply sorting
    if (sortKey) {
      const validSortKeys = ["when", "max_reservations", "price"];
      if (validSortKeys.includes(sortKey)) {
        const direction = sortDir?.toLowerCase() === "desc" ? "desc" : "asc";
        query = query.orderBy(sortKey, direction);
      }
    }

    // Apply limit
    if (limit) {
      query = query.limit(Number(limit));
    }

    const meals = await query;
    // Fetch reservations for all meals
    const mealIds = meals.map((meal) => meal.id);
    const reservations = await db("reservation")
      .whereIn("meal_id", mealIds)
      .select("meal_id")
      .sum({ guests: "number_of_guests" })
      .groupBy("meal_id");
    const reservationMap = {};
    reservations.forEach((r) => {
      reservationMap[r.meal_id] = Number(r.guests);
    });
    const mealsWithSpots = meals.map((meal) => ({
      ...meal,
      availableSpots: meal.max_reservations - (reservationMap[meal.id] || 0),
    }));
    res.json(mealsWithSpots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals/:id/reviews - Get all reviews for a specific meal
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await db("review")
      .where({ meal_id: req.params.id })
      .select("*")
      .orderBy("created_date", "desc");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals/:id - Get meal by ID
router.get("/:id", async (req, res) => {
  try {
    const meal = await db("meal").where({ id: req.params.id }).first();
    if (!meal) return res.status(404).json({ error: "Meal not found" });
    const reservation = await db("reservation")
      .where({ meal_id: meal.id })
      .sum({ guests: "number_of_guests" })
      .first();
    const availableSpots =
      meal.max_reservations - (Number(reservation.guests) || 0);
    res.json({ ...meal, availableSpots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/meals - Create new meal
router.post("/", async (req, res) => {
  try {
    const parseResult = mealSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const [id] = await db("meal").insert(parseResult.data);
    const newMeal = await db("meal").where({ id }).first();
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/meals/:id - Update meal
router.put("/:id", async (req, res) => {
  try {
    const parseResult = mealSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const updated = await db("meal")
      .where({ id: req.params.id })
      .update(parseResult.data);
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
