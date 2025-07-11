import React from "react";
import Navigation from "../Navigation/Navigation";
import MealsList from "../MealsList/MealsList";

import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      <Navigation />
      <MealsList />
    </div>
  );
}

export default HomePage;