import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Forget() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleNext = async () => {
  setError("");
  

  if (step === 1) {
    if (!email.trim()) return setError("Email is required.");
    if (!isValidEmail(email)) return setError("Please enter a valid email.");

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  } else if (step === 2) {
    if (!otp.trim()) return setError("OTP is required.");
    if (!/^\d{6}$/.test(otp.trim()))
      return setError("OTP must be a 6-digit number.");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      setStep(3);
    } catch (err) {
      setError(err.message);
    }
  } else if (step === 3) {
    const { newPassword, confirmPassword } = passwords;

    if (!newPassword || !confirmPassword)
      return setError("All password fields are required.");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Forgot Password
        </h2>

        {step === 1 && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        )}

        {step === 2 && (
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              placeholder="New Password"
              className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            />
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              placeholder="Confirm Password"
              className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            />
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          {step === 3 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
