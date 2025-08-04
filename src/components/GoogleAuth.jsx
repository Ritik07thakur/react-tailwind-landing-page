import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GoogleAuth() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window.google !== 'undefined') {
      console.log("✅ Google scripts loaded successfully");
    } else {
      console.log("❌ Google scripts not loaded");
      // console.log(window.google)

    }  
  }, []);

  const handleSuccess = async (credentialResponse) => {
    setSuccessMessage("");
    setErrorMessage("");

    const token = credentialResponse?.credential;

    if (!token) {
      setErrorMessage("❌ No token received from Google");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("🔍 Decoded Google Token:", decoded);

      // Step 1: Send token to backend
      const loginRes = await axios.post("http://localhost:5000/api/auth/google", { token });

      const { token: jwtToken, user } = loginRes.data;
      const userId = user?._id || loginRes.data?.userId || user?.id;

      if (!jwtToken || !userId) {
        throw new Error("Invalid Google login response: missing token or userId");
      }

      // Store in localStorage
      localStorage.setItem("token", jwtToken);
      localStorage.setItem("userId", userId);

      // Step 2: Fetch user data
      const userRes = await axios.get(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const userData = userRes.data.user;

      console.log("✅ Google login success!", userData);
      setSuccessMessage(`Welcome, ${userData.name || 'User'}! Redirecting to dashboard...`);

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("❌ Google login error:", error);
      const message =
        error?.response?.data?.message || "Google login failed. Please try again.";
      setErrorMessage(message);
    }
  };

  const handleError = (error) => {
    console.log("❌ Google login failed", error);
    setErrorMessage("Google login failed. Please try again.");
  };

  return (
   <div className="flex flex-col justify-center w-full max-w-xs mx-auto">
  <GoogleLogin
    onSuccess={handleSuccess}
    onError={handleError}
    size="large"
    theme="outline"
    text="signin_with"
  />

  {successMessage && (
    <p className="text-sm font-medium text-green-600 text-center">
      {successMessage}
    </p>
  )}

  {errorMessage && (
    <p className="text-sm font-medium text-red-600 text-center">
      {errorMessage}
    </p>
  )}
</div>

  );
}
