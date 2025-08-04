import React, { useState } from "react";
// import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "../components/GoogleAuth";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name must not contain numbers";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { label: "", color: "" };
    if (password.length < 6)
      return { label: "Weak password", color: "text-red-500" };
    if (password.length < 10)
      return { label: "Normal password", color: "text-yellow-500" };
    return { label: "Strong password", color: "text-green-500" };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          // Clear form and redirect (or show inline success message)
          setFormData({ name: "", email: "", password: "" });
          setErrors({});
          setSuccess("Signup successful! Redirecting...");
          setTimeout(() => navigate("/login"), 1500);
        } else if (response.status === 409) {
          // Email already exists
          setErrors({ email: result.message || "Email already registered" });
        } else {
          // Other backend errors
          setErrors({ general: result.message || "Signup failed" });
        }
      } catch (error) {
        setErrors({ general: "Something went wrong. Please try again later." });
        console.error("Signup error:", error);
      }
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  //   const handleGoogleLogin = async (token) => {
  //     console.log("google button clicked")
  //   try {
  //     const res = await fetch("http://localhost:5000/api/auth/google", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ token }),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       // Save token/userId to localStorage
  //       localStorage.setItem("token", data.token);
  //       localStorage.setItem("userId", data.user._id);
  //       setSuccess("Signup successful! Redirecting...");
  //       setTimeout(() => navigate("/dashboard"), 1500);
  //     } else {
  //       setErrors({ general: data.message || "Google Signup Failed" });
  //     }
  //   } catch (err) {
  //     console.error("Google login error:", err);
  //     setErrors({ general: "Something went wrong with Google login." });
  //   }
  // };

  // const abc=()=>{
  //   console.log("google button clicked ")
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-neutral-800 dark:text-white">
          Create an Account
        </h2>

        {success && (
          <p className="text-sm text-green-600 mb-4 text-center">{success}</p>
        )}
        {errors.general && (
          <p className="text-sm text-red-600 mb-4 text-center">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-700 text-neutral-800 dark:text-white ${
                errors.name
                  ? "border-red-500"
                  : "border-neutral-300 dark:border-slate-600"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-700 text-neutral-800 dark:text-white ${
                errors.email
                  ? "border-red-500"
                  : "border-neutral-300 dark:border-slate-600"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-md px-3 py-2 border bg-white dark:bg-slate-700 text-neutral-800 dark:text-white ${
                  errors.password
                    ? "border-red-500"
                    : "border-neutral-300 dark:border-slate-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 text-sm text-neutral-600 dark:text-neutral-300 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
            {passwordStrength.label && !errors.password && (
              <p className={`text-sm mt-1 ${passwordStrength.color}`}>
                {passwordStrength.label}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-600"
          >
            Sign Up
          </button>
        </form>

        {/* Social Auth */}
        <div className="mt-6 space-y-3">
          <GoogleAuth />

          <button
            type="button"
            disabled
            className="flex items-center justify-center gap-2 w-full rounded-md border border-neutral-400 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            <FaLinkedin size={18} className="text-blue-700 dark:text-white" />
            Continue with LinkedIn (Coming Soon)
          </button>
        </div>

        {/* </form> */}

        {/* Redirect to Login */}
        <div className="mt-6 text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="ml-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Login with existing account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
