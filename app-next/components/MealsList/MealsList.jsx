"use client";
import React, { useEffect, useState } from "react";
import "./MealsList.css";

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

  if (loading) return <p className="loading">Loading meals...</p>;

  if (meals.length === 0) return <p className="no-meals">No meals available.</p>;

  return (
    <div className="meals-container">
      <h2 className="meals-title">Available Meals</h2>
      <div className="meals-grid">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <h3>{meal.title}</h3>
            <p>{meal.description}</p>
            <p className="meal-price">{meal.price} DKK</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsList;