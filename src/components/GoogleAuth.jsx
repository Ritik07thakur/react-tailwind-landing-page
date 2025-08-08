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
  <div  className="flex flex-col items-center bg-white justify-center  rounded  space-y-4 py-2 px-4">
  <div className="w-full max-w-sm px-4 sm:px-6 md:px-10 lg:px-16">
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      size="medium"
      theme="outline"
      text="signin_with"
      width="100%"
    />
  </div>

  {successMessage && (
    <p className="text-green-600 font-medium text-sm text-center">
      {successMessage}
    </p>
  )}

  {errorMessage && (
    <p className="text-red-600 font-medium text-sm text-center">
      {errorMessage}
    </p>
  )}
</div>
  );
}
