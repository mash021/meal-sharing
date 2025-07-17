"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AddMeal.module.css";
import api from "../../../utils/api";

export default function AddMealPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    max_reservations: "",
    date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(api("/meals"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          max_reservations: Number(form.max_reservations),
        }),
      });
      if (!res.ok) throw new Error("Failed to add meal");
      router.push("/meals");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Add New Meal</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="e.g. Ghormeh Sabzi"
            />
          </label>
          <label className={styles.label}>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className={styles.textarea}
              placeholder="A short description about the meal..."
            />
          </label>
          <label className={styles.label}>
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="e.g. Tehran"
            />
          </label>
          <div className={styles.inputRow}>
            <label className={`${styles.label} ${styles.inputSmall}`}>
              Price
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                className={`${styles.input} ${styles.inputSmall}`}
                placeholder="e.g. 50000"
              />
            </label>
            <label className={`${styles.label} ${styles.inputSmall}`}>
              Max Reservations
              <input
                name="max_reservations"
                type="number"
                value={form.max_reservations}
                onChange={handleChange}
                required
                min="1"
                className={`${styles.input} ${styles.inputSmall}`}
                placeholder="e.g. 10"
              />
            </label>
          </div>
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
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Adding..." : "Add Meal"}
          </button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
