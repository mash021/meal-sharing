"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../utils/api";
import styles from "./ReservationForm.module.css";

// Add a StarRating component for clickable stars
function StarRating({ value, onChange, editable = false }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        cursor: editable ? "pointer" : "default",
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={editable ? () => onChange(star) : undefined}
          style={{
            color: star <= value ? "#fbbf24" : "#e5e7eb",
            fontSize: "1.6rem",
            transition: "color 0.2s",
            userSelect: "none",
          }}
          role={editable ? "button" : undefined}
          aria-label={editable ? `Set rating to ${star}` : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}

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
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    description: "",
    stars: 5,
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    fetch(api(`/meals/${id}`))
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

  // Fetch reviews for this meal
  useEffect(() => {
    if (!id) return;
    fetch(api(`/meals/${id}/reviews`))
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]));
  }, [id, reviewSuccess]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(api(`/meals/${id}`), {
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
      const res = await fetch(api(`/meals/${id}`), {
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
      const res = await fetch(api("/reservations"), {
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

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");
    try {
      const res = await fetch(api("/reviews"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reviewForm,
          meal_id: Number(id),
          stars: Number(reviewForm.stars),
          created_date: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setReviewSuccess("Review submitted!");
      setReviewForm({ title: "", description: "", stars: 5 });
    } catch (err) {
      setReviewError(err.message || "Something went wrong");
    } finally {
      setReviewLoading(false);
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
          <form onSubmit={handleResSubmit} className={styles.reservationForm}>
            <label className={styles.label}>
              Name
              <input
                name="name"
                value={resForm.name}
                onChange={handleResChange}
                required
                className={styles.input}
                placeholder="Your name"
              />
            </label>
            <label className={styles.label}>
              Phone
              <input
                name="phone"
                value={resForm.phone}
                onChange={handleResChange}
                required
                className={styles.input}
                placeholder="Your phone number"
              />
            </label>
            <label className={styles.label}>
              Email
              <input
                name="email"
                type="email"
                value={resForm.email}
                onChange={handleResChange}
                required
                className={styles.input}
                placeholder="Your email"
              />
            </label>
            <label className={styles.label}>
              Number of Guests
              <input
                name="number_of_guests"
                type="number"
                min="1"
                value={resForm.number_of_guests}
                onChange={handleResChange}
                required
                className={styles.input}
                placeholder="Guests"
              />
            </label>
            <button
              type="submit"
              disabled={resLoading}
              className={styles.button}
            >
              {resLoading ? "Reserving..." : "Reserve"}
            </button>
            {resError && <div className={styles.error}>{resError}</div>}
            {resSuccess && <div className={styles.success}>{resSuccess}</div>}
          </form>
        </>
      )}
      {/* Review Section */}
      <hr style={{ margin: "32px 0 24px 0" }} />
      <h3 style={{ marginBottom: 12 }}>Reviews & Ratings</h3>
      <div style={{ marginBottom: 24 }}>
        {reviews.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center" }}>
            No reviews yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {reviews.map((r) => (
              <div
                key={r.id}
                style={{
                  background: "#f7f7fa",
                  borderRadius: 10,
                  padding: 16,
                  boxShadow: "0 1px 4px #e0e7ef",
                  border: "1px solid #e0e7ef",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 16 }}>
                    {r.title}
                  </span>
                  <span style={{ color: "#fbbf24", fontSize: 18 }}>
                    {"★".repeat(r.stars)}
                    {"☆".repeat(5 - r.stars)}
                  </span>
                </div>
                <div style={{ color: "#444", fontSize: 15 }}>
                  {r.description}
                </div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
                  {new Date(r.created_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <h3 style={{ marginTop: 40 }}>Leave a review</h3>
      <form
        onSubmit={handleReviewSubmit}
        className={styles.reservationForm}
        style={{ marginTop: 32 }}
      >
        <label className={styles.label}>
          Title
          <input
            name="title"
            value={reviewForm.title}
            onChange={handleReviewChange}
            required
            className={styles.input}
            placeholder="Review title"
          />
        </label>
        <label className={styles.label}>
          Description
          <textarea
            name="description"
            value={reviewForm.description}
            onChange={handleReviewChange}
            required
            className={styles.input}
            placeholder="Your review..."
            rows={3}
          />
        </label>
        <label className={styles.label}>
          Rating
          <StarRating
            value={reviewForm.stars}
            onChange={(val) => setReviewForm((f) => ({ ...f, stars: val }))}
            editable={true}
          />
        </label>
        <button
          type="submit"
          className={styles.button}
          disabled={reviewLoading}
        >
          {reviewLoading ? "Submitting..." : "Submit Review"}
        </button>
        {reviewError && <div className={styles.error}>{reviewError}</div>}
        {reviewSuccess && <div className={styles.success}>{reviewSuccess}</div>}
      </form>

      <h3 style={{ marginTop: 40 }}>Reviews</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {reviews.length === 0 && <div>No reviews yet.</div>}
        {reviews.map((r) => (
          <div key={r.id} className={styles.reviewCard}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StarRating value={r.stars} />
              <span style={{ fontWeight: 600 }}>{r.title}</span>
            </div>
            <div style={{ color: "#444", marginTop: 4 }}>{r.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
