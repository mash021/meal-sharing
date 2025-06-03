import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import knex from "./database_client.js";
import mealsRouter from "./routers/meals.js"; // Meals router
import reservationsRouter from "./routers/reservations.js";
import reviewsRouter from "./routers/reviews.js"; // Reviews router

dotenv.config(); // Load environment variables from .env file

// Print DB configuration for debugging
console.log("Environment variables:", {
  DB_CLIENT: process.env.DB_CLIENT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,
});

const app = express();
const apiRouter = express.Router();

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Mount routers
app.use("/api/meals", mealsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/reviews", reviewsRouter);

// GET /api/ - Health check: list all database tables
apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  try {
    const [tables] = await knex.raw(SHOW_TABLES_QUERY);
    res.json({ tables });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals - Return all meals
apiRouter.get("/meals", async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reservations - Return all reservations
apiRouter.get("/reservations", async (req, res) => {
  try {
    const [reservations] = await knex.raw("SELECT * FROM reservation");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/future-meals - Meals scheduled after now
apiRouter.get("/future-meals", async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/past-meals - Meals scheduled before now
apiRouter.get("/past-meals", async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/all-meals - All meals ordered by ID
apiRouter.get("/all-meals", async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/first-meal - Meal with lowest ID
apiRouter.get("/first-meal", async (req, res) => {
  try {
    const [meal] = await knex.raw("SELECT * FROM meal ORDER BY id ASC LIMIT 1");
    if (!meal.length) {
      return res.status(404).json({ error: "No meals found" });
    }
    res.json(meal[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/last-meal - Meal with highest ID
apiRouter.get("/last-meal", async (req, res) => {
  try {
    const [meal] = await knex.raw(
      "SELECT * FROM meal ORDER BY id DESC LIMIT 1"
    );
    if (!meal.length) {
      return res.status(404).json({ error: "No meals found" });
    }
    res.json(meal[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mount all general routes under /api
app.use("/api", apiRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API server is running at http://localhost:${PORT}`);
});
