"use client";
import React, { useEffect, useState } from "react";

import Meal from "./Meal";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/meals");
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (meals.length === 0) {
    return <div style={{ padding: "20px" }}>No meals available.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Meals</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {meals.map((meal) => (
          <div key={meal.id} style={{ flex: "1 0 30%", border: "1px solid #ccc", padding: "10px" }}>
            <Meal meal={meal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsList;