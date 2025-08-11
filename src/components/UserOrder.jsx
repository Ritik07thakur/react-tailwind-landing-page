import React, { useState } from "react";
import axios from "axios";

export default function UserOrder({ onOrderPlaced }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    food: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const foodOptions = [
    "Pizza",
    "Burger",
    "Pasta",
    "Sandwich",
    "Salad",
    "Fries",
    "Tacos",
    "Noodles",
    "Biryani",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.food) newErrors.food = "Please select a food item";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/user/orderPlace",
        {
          name: formData.name,
          email: formData.email,
          food: formData.food,
        }
      );

      setSuccess(response.data.message || "Order placed successfully!");
      setErrors({});
      setFormData({ name: "", email: "", food: "" });

      // ✅ Trigger parent to refresh the orders list
      if (onOrderPlaced) {
        onOrderPlaced();
      }

      // Close form after 1s
      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 100);
    } catch (error) {
      console.error("Order submission error:", error);
      setSuccess("");
      if (error.response?.data?.error) {
        setErrors({ api: error.response.data.error });
      } else {
        setErrors({ api: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-12">
      <button
        onClick={() => setShowForm(true)}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full shadow-lg text-lg font-semibold transition-transform transform hover:scale-105"
      >
        🍔 Place an Order
      </button>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 animate-slideUp">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-500">
              Order Your Favorite Food
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Food */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Food
                </label>
                <select
                  name="food"
                  value={formData.food}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-800 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Select Food --</option>
                  {foodOptions.map((food, index) => (
                    <option key={index} value={food}>
                      {food}
                    </option>
                  ))}
                </select>
                {errors.food && (
                  <p className="text-red-500 text-sm mt-1">{errors.food}</p>
                )}
              </div>

              {/* API Error */}
              {errors.api && (
                <p className="text-red-500 font-medium text-center">
                  {errors.api}
                </p>
              )}

              {/* Success */}
              {success && (
                <p className="text-green-600 font-medium text-center">
                  {success}
                </p>
              )}

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                    setSuccess("");
                  }}
                  className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-md disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Placing..." : "✅ Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
