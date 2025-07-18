"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../utils/api";
import styles from "./MealDetail.module.css";

// Enhanced StarRating component with better styling
function StarRating({ value, onChange, editable = false, size = "1.2rem" }) {
  return (
    <div
      className={styles.starRating}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={editable ? () => onChange(star) : undefined}
          className={`${styles.star} ${
            star <= value ? styles.filled : styles.empty
          }`}
          style={{ fontSize: size }}
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
  const [showReviewForm, setShowReviewForm] = useState(false);

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
  const fetchReviews = async () => {
    if (!id) return;
    try {
      const res = await fetch(api(`/meals/${id}/reviews`));
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

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
          created_date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit review");
      }
      setReviewSuccess("Review submitted successfully!");
      setReviewForm({ title: "", description: "", stars: 5 });
      setShowReviewForm(false);
      // Refresh reviews after successful submission
      fetchReviews();
    } catch (err) {
      setReviewError(err.message || "Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  };

  if (error) return <div className={styles.errorContainer}>{error}</div>;
  if (!meal) return <div className={styles.loadingContainer}>Loading...</div>;

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
      : 0;

  return (
    <div className={styles.container}>
      {/* Hero Section with Full Image */}
      <div className={styles.heroSection}>
        <div className={styles.imageContainer}>
          <img
            src={meal.image_url || "/images/default.jpg"}
            alt={meal.title}
            className={styles.heroImage}
            onError={(e) => {
              e.target.src = "/images/default.jpg";
            }}
          />
          <div className={styles.imageOverlay}>
            <div className={styles.heroContent}>
              <h1 className={styles.mealTitle}>{meal.title}</h1>
              <div className={styles.mealMeta}>
                <span className={styles.location}>📍 {meal.location}</span>
                <span className={styles.price}>💰 ${meal.price}</span>
                <span className={styles.date}>
                  📅 {new Date(meal.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Meal Details Section */}
        <section className={styles.detailsSection}>
          <div className={styles.sectionHeader}>
            <h2>About This Meal</h2>
            <div className={styles.actionButtons}>
              <button
                onClick={() => setEditMode(true)}
                className={styles.editButton}
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className={styles.deleteButton}
                disabled={loading}
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {editMode ? (
            <form onSubmit={handleEdit} className={styles.editForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Price</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Max Reservations</label>
                  <input
                    name="max_reservations"
                    type="number"
                    value={form.max_reservations}
                    onChange={handleChange}
                    required
                    min="1"
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Date</label>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className={styles.textarea}
                  rows={4}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="submit"
                  disabled={loading}
                  className={styles.saveButton}
                >
                  {loading ? "Saving..." : "💾 Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className={styles.cancelButton}
                >
                  ❌ Cancel
                </button>
              </div>
              {error && <div className={styles.error}>{error}</div>}
            </form>
          ) : (
            <div className={styles.mealInfo}>
              <p className={styles.description}>{meal.description}</p>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>📍 Location:</span>
                  <span className={styles.infoValue}>{meal.location}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>💰 Price:</span>
                  <span className={styles.infoValue}>${meal.price}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>👥 Max Guests:</span>
                  <span className={styles.infoValue}>
                    {meal.max_reservations}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>📅 Date:</span>
                  <span className={styles.infoValue}>
                    {new Date(meal.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <section className={styles.reviewsSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Reviews & Ratings</h2>
              <div className={styles.ratingSummary}>
                <StarRating value={Math.round(averageRating)} size="1.5rem" />
                <span className={styles.ratingText}>
                  {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className={styles.addReviewButton}
            >
              {showReviewForm ? "❌ Cancel" : "✍️ Write Review"}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className={styles.reviewFormContainer}>
              <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                <div className={styles.formGroup}>
                  <label>Review Title</label>
                  <input
                    name="title"
                    value={reviewForm.title}
                    onChange={handleReviewChange}
                    required
                    className={styles.input}
                    placeholder="Give your review a title..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Your Review</label>
                  <textarea
                    name="description"
                    value={reviewForm.description}
                    onChange={handleReviewChange}
                    required
                    className={styles.textarea}
                    placeholder="Share your experience with this meal..."
                    rows={4}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Rating</label>
                  <StarRating
                    value={reviewForm.stars}
                    onChange={(val) =>
                      setReviewForm((f) => ({ ...f, stars: val }))
                    }
                    editable={true}
                    size="1.8rem"
                  />
                </div>
                <button
                  type="submit"
                  className={styles.submitReviewButton}
                  disabled={reviewLoading}
                >
                  {reviewLoading ? "Submitting..." : "📝 Submit Review"}
                </button>
                {reviewError && (
                  <div className={styles.error}>{reviewError}</div>
                )}
                {reviewSuccess && (
                  <div className={styles.success}>{reviewSuccess}</div>
                )}
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className={styles.reviewsList}>
            {reviews.length === 0 ? (
              <div className={styles.noReviews}>
                <div className={styles.noReviewsIcon}>💬</div>
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewTitle}>
                      <h4>{review.title}</h4>
                      <StarRating value={review.stars} size="1.2rem" />
                    </div>
                    <span className={styles.reviewDate}>
                      {new Date(review.created_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.reviewDescription}>
                    {review.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Reservation Section */}
        <section className={styles.reservationSection}>
          <div className={styles.sectionHeader}>
            <h2>Reserve This Meal</h2>
            <p className={styles.sectionSubtitle}>
              Secure your spot for this delicious meal experience
            </p>
          </div>

          <form onSubmit={handleResSubmit} className={styles.reservationForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  name="name"
                  value={resForm.name}
                  onChange={handleResChange}
                  required
                  className={styles.input}
                  placeholder="Enter your full name"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={resForm.phone}
                  onChange={handleResChange}
                  required
                  className={styles.input}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={resForm.email}
                  onChange={handleResChange}
                  required
                  className={styles.input}
                  placeholder="Enter your email address"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Number of Guests</label>
                <input
                  name="number_of_guests"
                  type="number"
                  min="1"
                  max={meal.max_reservations}
                  value={resForm.number_of_guests}
                  onChange={handleResChange}
                  required
                  className={styles.input}
                  placeholder="How many guests?"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={resLoading}
              className={styles.reserveButton}
            >
              {resLoading ? "Reserving..." : "🎯 Reserve Now"}
            </button>
            {resError && <div className={styles.error}>{resError}</div>}
            {resSuccess && <div className={styles.success}>{resSuccess}</div>}
          </form>
        </section>
      </div>
    </div>
  );
}
