import React from "react";
import MealsList from "../components/MealsList";
import "../components/HomePage/HomePage.css";

function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to Meal Sharing</h1>
      <p>Find delicious meals and book your seat!</p>
      <MealsList limit={3} />
      <a href="/meals">
        <button className="see-all-button">See all meals</button>
      </a>
    </div>
  );
}

export default HomePage;