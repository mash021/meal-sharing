"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function MealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [meal, setMeal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resForm, setResForm] = useState({
    name: "",
    phone: "",
    email: "",
    number_of_guests: 1,
  });
  const [resLoading, setResLoading] = useState(false);
  const [resError, setResError] = useState("");
  const [resSuccess, setResSuccess] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3001/api/meals/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMeal(data);
        setForm({
          title: data.title,
          description: data.description,
          location: data.location,
          price: data.price,
          max_reservations: data.max_reservations,
          date: data.date?.slice(0, 10) || "",
        });
      })
      .catch(() => setError("Meal not found"));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:3001/api/meals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          max_reservations: Number(form.max_reservations),
        }),
      });
      if (!res.ok) throw new Error("Failed to update meal");
      setEditMode(false);
      setMeal({ ...meal, ...form });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meal?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:3001/api/meals/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete meal");
      router.push("/meals");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResChange = (e) => {
    setResForm({ ...resForm, [e.target.name]: e.target.value });
  };

  const handleResSubmit = async (e) => {
    e.preventDefault();
    setResLoading(true);
    setResError("");
    setResSuccess("");
    try {
      const res = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_id: id,
          ...resForm,
          number_of_guests: Number(resForm.number_of_guests),
        }),
      });
      if (!res.ok) throw new Error("Reservation failed");
      setResSuccess("Reservation successful!");
      setResForm({ name: "", phone: "", email: "", number_of_guests: 1 });
    } catch (err) {
      setResError(err.message || "Something went wrong");
    } finally {
      setResLoading(false);
    }
  };

  if (error) return <div style={{ color: "red", padding: 24 }}>{error}</div>;
  if (!meal) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
      }}
    >
      {editMode ? (
        <form
          onSubmit={handleEdit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Price
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
            />
          </label>
          <label>
            Max Reservations
            <input
              name="max_reservations"
              type="number"
              value={form.max_reservations}
              onChange={handleChange}
              required
              min="1"
            />
          </label>
          <label>
            Date
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 0",
              background: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            style={{
              background: "#eee",
              color: "#333",
              border: "none",
              borderRadius: 4,
              padding: "10px 0",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </form>
      ) : (
        <>
          <h2>{meal.title}</h2>
          <p>
            <b>Description:</b> {meal.description}
          </p>
          <p>
            <b>Location:</b> {meal.location}
          </p>
          <p>
            <b>Price:</b> {meal.price}
          </p>
          <p>
            <b>Max Reservations:</b> {meal.max_reservations}
          </p>
          <p>
            <b>Date:</b> {meal.date?.slice(0, 10)}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              onClick={() => setEditMode(true)}
              style={{
                padding: "10px 20px",
                background: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: "10px 20px",
                background: "#e00",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontWeight: 600,
                cursor: "pointer",
              }}
              disabled={loading}
            >
              Delete
            </button>
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <hr style={{ margin: "32px 0 24px 0" }} />
          <h3>Reserve this meal</h3>
          <form
            onSubmit={handleResSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 8,
            }}
          >
            <label>
              Name
              <input
                name="name"
                value={resForm.name}
                onChange={handleResChange}
                required
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                value={resForm.phone}
                onChange={handleResChange}
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={resForm.email}
                onChange={handleResChange}
                required
              />
            </label>
            <label>
              Number of Guests
              <input
                name="number_of_guests"
                type="number"
                min="1"
                value={resForm.number_of_guests}
                onChange={handleResChange}
                required
              />
            </label>
            <button
              type="submit"
              disabled={resLoading}
              style={{
                padding: "10px 0",
                background: "#4895ef",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {resLoading ? "Reserving..." : "Reserve"}
            </button>
            {resError && <div style={{ color: "#e63946" }}>{resError}</div>}
            {resSuccess && <div style={{ color: "#2ecc40" }}>{resSuccess}</div>}
          </form>
        </>
      )}
    </div>
  );
}
