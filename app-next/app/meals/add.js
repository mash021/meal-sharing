"use client";
import { useState } from "react";
import api from "../../utils/api";

// Replace with your Cloudinary unsigned upload preset and cloud name
const CLOUDINARY_UPLOAD_PRESET = "ml_default";
const CLOUDINARY_CLOUD_NAME = "demo";

export default function AddMealPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    when: "",
    max_reservations: "",
    price: "",
    created_date: "",
    image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    let imageUrl = form.image_url;
    try {
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }
      const res = await fetch(api("/meals"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image_url: imageUrl,
          max_reservations: Number(form.max_reservations),
          price: Number(form.price),
        }),
      });
      if (res.ok) {
        setMessage("Meal added successfully!");
        setForm({
          title: "",
          description: "",
          location: "",
          when: "",
          max_reservations: "",
          price: "",
          created_date: "",
          image_url: "",
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        const data = await res.json();
        setMessage(
          data.error ? JSON.stringify(data.error) : "Error adding meal"
        );
      }
    } catch (err) {
      setMessage("Error adding meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Add Meal</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="when"
          type="datetime-local"
          placeholder="When"
          value={form.when}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="max_reservations"
          type="number"
          placeholder="Max Reservations"
          value={form.max_reservations}
          onChange={handleChange}
          required
          min={1}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          min={1}
          step={0.01}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          name="created_date"
          type="date"
          placeholder="Created Date"
          value={form.created_date}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ padding: 8 }}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: 200,
              margin: "0 auto",
              borderRadius: 8,
            }}
          />
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            borderRadius: 4,
            border: "none",
            background: "#222",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Adding..." : "Add Meal"}
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: 16,
            textAlign: "center",
            color: message.includes("success") ? "#228B22" : "#B22222",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
