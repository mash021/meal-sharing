import React from "react";
import MealsList from "../components/MealsList";

function MealsPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Meals</h1>
      <MealsList />
    </div>
  );
}

export default MealsPage;