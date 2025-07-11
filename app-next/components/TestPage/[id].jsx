import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MealDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState({
    name: "",
    email: "",
    phonenumber: ""
  });
  const [review, setReview] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchMeal = async () => {
      const res = await fetch(`http://localhost:3001/api/meals/${id}`);
      const data = await res.json();
      setMeal(data);
      setLoading(false);
    };
    fetchMeal();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!meal) return <div>Meal not found.</div>;

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_id: meal.id,
          ...reservation
        }),
      });
      if (res.ok) {
        alert("Reservation created!");
      } else {
        alert("Error creating reservation.");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating reservation.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_id: meal.id,
          description: review
        }),
      });
      if (res.ok) {
        alert("Review submitted!");
        setReview("");
      } else {
        alert("Error submitting review.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting review.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{meal.title}</h1>
      <p>{meal.description}</p>
      <p>Price: {meal.price} DKK</p>

      {meal.max_reservations > meal.reservations.length ? (
        <form onSubmit={handleReservationSubmit}>
          <h3>Book a seat</h3>
          <input
            type="text"
            placeholder="Name"
            value={reservation.name}
            onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={reservation.email}
            onChange={(e) => setReservation({ ...reservation, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={reservation.phonenumber}
            onChange={(e) => setReservation({ ...reservation, phonenumber: e.target.value })}
            required
          />
          <button type="submit">Book Seat</button>
        </form>
      ) : (
        <p>No seats available.</p>
      )}

      <form onSubmit={handleReviewSubmit} style={{ marginTop: "2rem" }}>
        <h3>Leave a review</h3>
        <textarea
          placeholder="Write your review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}