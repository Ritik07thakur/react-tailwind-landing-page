import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (/\d/.test(formData.name)) {
      newErrors.name = "Name should not contain numbers.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required.";
    }

    if (!["admin", "customer"].includes(formData.role)) {
      newErrors.role = "Role must be admin or customer.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      setMessage("✅ User created successfully!");
      setFormData({ name: "", email: "", password: "", role: "customer" });
      window.location.reload();
    } catch (error) {
      console.error("Signup Error:", error);
      setMessage("❌ Something went wrong. Try again.");
    }

    setLoading(false);
  };

  // const handleBack = () => {
  //   navigate("/dashboard");
  // };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-white">🚀 Create New User</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Fill in the form below to sign up</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border shadow-sm focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border shadow-sm focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border shadow-sm focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border shadow-sm focus:outline-none focus:ring-2 ${
                errors.role ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"
              }`}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 shadow-md"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
            {/* <button
              type="button"
              onClick={handleBack}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 shadow-md"
            >
              Back
            </button> */}
          </div>

          {/* Message */}
          {message && (
            <div className="text-center mt-4 text-sm text-gray-800 dark:text-gray-200">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
