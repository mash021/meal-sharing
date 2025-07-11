"use client";
import React, { useEffect, useState } from "react";
import Meal from "./Meal";
import "./MealsList.css";

const sortFields = [
  { value: "when", label: "Date" },
  { value: "max_reservations", label: "Max Reservations" },
  { value: "price", label: "Price" },
];

const sortDirections = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("when");
  const [sortDir, setSortDir] = useState("asc");

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("title", search);
      if (sortKey) params.append("sortKey", sortKey);
      if (sortDir) params.append("sortDir", sortDir);
      const response = await fetch(
        `http://localhost:3001/api/meals?${params.toString()}`
      );
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

  useEffect(() => {
    fetchMeals();
    // eslint-disable-next-line
  }, [sortKey, sortDir]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMeals();
    }, 5000);
    return () => clearInterval(interval);
  }, [search, sortKey, sortDir]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMeals();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (meals.length === 0) {
    return <div className="no-meals">No meals available.</div>;
  }

  return (
    <div className="meals-container">
      <h2 className="meals-title">Available Meals</h2>
      <form className="meals-controls" onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc", minWidth: 180 }}
        />
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}>
          {sortFields.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <select value={sortDir} onChange={(e) => setSortDir(e.target.value)} style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}>
          {sortDirections.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: "0.5rem 1.2rem", borderRadius: 4, border: "none", background: "#222", color: "#fff", cursor: "pointer" }}>Search</button>
      </form>
      <hr className="line-mute" />
      <div className="meals-grid">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <Meal meal={meal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsList;