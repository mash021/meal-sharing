import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import mealsRouter from "./routers/meals.router.js";
import knex from "./database_client.js";

dotenv.config();

const app = express();
const apiRouter = express.Router();

// Enable CORS for frontend running on port 3000
app.use(cors({ origin: "http://localhost:3000" }));

// Parse incoming JSON request bodies
app.use(bodyParser.json());

// Log environment variables for debugging purposes
console.log("Environment variables:", {
  DB_CLIENT: process.env.DB_CLIENT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,
});

// ------------------ API ROUTES ------------------

// Health check route - list all database tables
apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const [tables] = await knex.raw(SHOW_TABLES_QUERY);
  res.json({ tables });
});

// Get all meals
apiRouter.get("/meals", async (req, res) => {
  const [meals] = await knex.raw("SELECT * FROM meal");
  res.json(meals);
});

// Get all reservations
apiRouter.get("/reservations", async (req, res) => {
  const [reservations] = await knex.raw("SELECT * FROM reservation");
  res.json(reservations);
});

// Get all reviews
apiRouter.get("/reviews", async (req, res) => {
  const [reviews] = await knex.raw("SELECT * FROM review");
  res.json(reviews);
});

// Get meals scheduled in the future
apiRouter.get("/future-meals", async (req, res) => {
  const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
  res.json(meals);
});

// Get meals from the past
apiRouter.get("/past-meals", async (req, res) => {
  const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
  res.json(meals);
});

// Get all meals ordered by ID
apiRouter.get("/all-meals", async (req, res) => {
  const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id");
  res.json(meals);
});

// Get the first meal (with the lowest ID)
apiRouter.get("/first-meal", async (req, res) => {
  const [meal] = await knex.raw("SELECT * FROM meal ORDER BY id ASC LIMIT 1");
  if (!meal.length) return res.status(404).json({ error: "No meals found" });
  res.json(meal[0]);
});

// Get the last meal (with the highest ID)
apiRouter.get("/last-meal", async (req, res) => {
  const [meal] = await knex.raw("SELECT * FROM meal ORDER BY id DESC LIMIT 1");
  if (!meal.length) return res.status(404).json({ error: "No meals found" });
  res.json(meal[0]);
});

// ------------------ MOUNT ROUTERS ------------------

// Main API router
app.use("/api", apiRouter);

// Meals-specific router
app.use("/meals", mealsRouter);

// ------------------ START SERVER ------------------

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server is running at http://localhost:${PORT}`);
});
