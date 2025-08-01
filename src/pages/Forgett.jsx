import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Forgett() {
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

  const handleNext = () => {
    setError("");

    if (step === 1) {
      if (!email.trim()) {
        setError("Email is required.");
        return;
      }
      if (!isValidEmail(email)) {
        setError("Please enter a valid email.");
        return;
      }
      setStep(2);
      // Send OTP to email here
    } else if (step === 2) {
      if (!otp.trim()) {
        setError("OTP is required.");
        return;
      }
      if (!/^\d{6}$/.test(otp.trim())) {
        setError("OTP must be a 6-digit number.");
        return;
      }
      setStep(3);
      // Optionally verify OTP here
    } else if (step === 3) {
      const { newPassword, confirmPassword } = passwords;

      if (!newPassword || !confirmPassword) {
        setError("All password fields are required.");
        return;
      }
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      // Call API to change password here
      console.log("Reset password for:", email);
      navigate("/login");
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
