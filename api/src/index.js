import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import knex from "./database_client.js";
import mealsRouter from "./routers/meals.js";
import reservationsRouter from "./routers/reservations.js";
import reviewsRouter from "./routers/reviews.js";
import cors from "cors";

dotenv.config();

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/meals", mealsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/reviews", reviewsRouter);

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

apiRouter.get("/meals", async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/reservations", async (req, res) => {
  try {
    const [reservations] = await knex.raw("SELECT * FROM reservation");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/future-meals", async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` > NOW()");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/past-meals", async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal WHERE `when` < NOW()");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get("/all-meals", async (req, res) => {
  try {
    const [meals] = await knex.raw("SELECT * FROM meal ORDER BY id");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

app.use("/api", apiRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ API server is running at http://localhost:${PORT}`);
});
