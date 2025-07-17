"use client";
import { useEffect, useState } from "react";
import styles from "./ReservationForm.module.css";

export default function ReservationsPage() {
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState({
    meal_id: "",
    name: "",
    phone: "",
    email: "",
    number_of_guests: 1,
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("https://meal-sharing-lvw1.onrender.com/api/meals")
      .then((res) => res.json())
      .then((data) => setMeals(data))
      .catch(() => setMeals([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        "https://meal-sharing-lvw1.onrender.com/api/reservations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            number_of_guests: Number(form.number_of_guests),
          }),
        }
      );
      if (!res.ok) throw new Error("Reservation failed");
      setSuccess("Reservation successful!");
      setForm({
        meal_id: "",
        name: "",
        phone: "",
        email: "",
        number_of_guests: 1,
        date: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Make a Reservation</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Meal
            <select
              name="meal_id"
              value={form.meal_id}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="" disabled>
                Select a meal
              </option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>
                  {meal.title}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Phone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Date
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>
          <div className={styles.inputRow}>
            <label className={`${styles.label} ${styles.inputSmall}`}>
              Number of Guests
              <input
                name="number_of_guests"
                type="number"
                min="1"
                value={form.number_of_guests}
                onChange={handleChange}
                required
                className={`${styles.input} ${styles.inputSmall}`}
              />
            </label>
          </div>
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Reserving..." : "Reserve"}
          </button>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
        </form>
      </div>
    </div>
  );
}
