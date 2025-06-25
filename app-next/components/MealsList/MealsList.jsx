"use client";
import React, { useEffect, useState } from "react";
import Meal from "./Meal";
import { Grid, Container, Typography, CircularProgress } from "@mui/material";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/meals");
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  if (meals.length === 0)
    return <Typography>No meals available.</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Meals
      </Typography>
      <Grid container spacing={3}>
        {meals.map((meal) => (
          <Grid item xs={12} sm={6} md={4} key={meal.id} sx={{ display: "flex" }}>
            <Meal meal={meal} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MealsList;