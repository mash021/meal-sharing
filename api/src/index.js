import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mealsRouter from "./routers/meals.router.js"; // Meals-specific router

dotenv.config();

// Print environment variables for debugging
console.log("Environment variables:", {
  DB_CLIENT: process.env.DB_CLIENT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,
});

import knex from "./database_client.js";

const app = express();
const apiRouter = express.Router();

app.use(bodyParser.json());

// Health check – list all tables in the database
apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const [tables] = await knex.raw(SHOW_TABLES_QUERY);
  res.json({ tables });
});

// Return all meals
apiRouter.get("/meals", async (req, res) => {
  const [meals] = await knex.raw("SELECT * FROM meal");
  res.json(meals);
});

// Return all reservations
apiRouter.get("/reservations", async (req, res) => {
  const [reservations] = await knex.raw("SELECT * FROM reservation");
  res.json(reservations);
});

// Return all reviews
apiRouter.get("/reviews", async (req, res) => {
  const [reviews] = await knex.raw("SELECT * FROM review");
  res.json(reviews);
});

// Return meals scheduled in the future
apiRouter.get("/future-meals", async (req, res) => {
  const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
  res.json(meals);
});

// Return meals from the past
apiRouter.get("/past-meals", async (req, res) => {
  const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
  res.json(meals);
});

// Return all meals ordered by ID
apiRouter.get("/all-meals", async (req, res) => {
  const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id");
  res.json(meals);
});

// Return the first meal (lowest ID)
apiRouter.get("/first-meal", async (req, res) => {
  const [meal] = await knex.raw("SELECT * FROM meal ORDER BY id ASC LIMIT 1");
  if (!meal.length) {
    return res.status(404).json({ error: "No meals found" });
  }
  res.json(meal[0]);
});

// Return the last meal (highest ID)
apiRouter.get("/last-meal", async (req, res) => {
  const [meal] = await knex.raw("SELECT * FROM meal ORDER BY id DESC LIMIT 1");
  if (!meal.length) {
    return res.status(404).json({ error: "No meals found" });
  }
  res.json(meal[0]);
});

// Mount routers
app.use("/api", apiRouter); // Main API endpoints
app.use("/meals", mealsRouter); // Custom meals router

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API server is running at http://localhost:${PORT}`);
});
