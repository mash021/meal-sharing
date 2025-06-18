import React from "react";
import MealsList from "../MealsList/MealsList";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to the Meal Sharing App</h1>
      <MealsList />
    </div>
  );
}

export default HomePage;