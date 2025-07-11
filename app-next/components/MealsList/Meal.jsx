import React from "react";
import Link from "next/link";
import "./Meal.css";

const imageMap = {
  1: "/images/gheymeh.jpg",
  2: "/images/kabab.jpg",
  3: "/images/zereshk.jpg",
  4: "/images/fesenjan.jpg",
  5: "/images/ash.jpeg",
  6: "/images/baghali.jpg",
};

const Meal = ({ meal }) => {
  const imageUrl = imageMap[meal.id] || "/images/default.jpg";

  return (
    <Link href={`/meals/${meal.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="meal-inner" style={{ cursor: "pointer" }}>
        <img src={imageUrl} alt={meal.title} className="meal-image" />
        <div className="meal-content">
          <h3 className="meal-title">{meal.title}</h3>
          <p className="meal-description">{meal.description}</p>
          <button className="meal-price">{meal.price} DKK</button>
          <div style={{ marginTop: 12, fontWeight: 600, color: meal.availableSpots > 0 ? '#228B22' : '#B22222' }}>
            {typeof meal.availableSpots === 'number'
              ? meal.availableSpots > 0
                ? `${meal.availableSpots} spots left`
                : 'Fully booked'
              : ''}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Meal;