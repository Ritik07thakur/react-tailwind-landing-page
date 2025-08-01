import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Loginn = () => {
  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State for UI messages
  const [success, setSuccess] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Hook for navigation
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Basic form validation (you can expand this)
  const validate = () => {
    if (!formData.email || !formData.password) {
      setGeneralError('Email and password are required.');
      return false;
    }
    return true;
  };

  // Handle form submission and login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setGeneralError('');

    if (!validate()) return;

    try {
      // Step 1: Use POST method and login API
      const response = await axios.post("http://localhost:5000/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Step 2: Get ID and token of specific person
      const { token, user } = response.data;
      
      if (!token || !user || !user._id) {
          throw new Error("Invalid response from server. Missing token or user ID.");
      }

      // Step 3: Store locally
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);

      setSuccess("Login successful!");
      
      // Log for verification
      console.log("Login successful!");
      console.log("The user token => " + token);
      console.log("The user ID => " + user._id);
      console.log("The user name => " + user.name); // Assuming user.name is in the response
      console.log("The user email => " + user.email);
      console.log("The user role => " + user.role);
      
      // Redirect to the dashboard after a short delay
      setTimeout(() => navigate("/dashboard"), 1000);

    } catch (err) {
      // Error handling for login failures
      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Something went wrong. Please try again later.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Login</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {generalError && <p style={{ color: 'red' }}>{generalError}</p>}
    </div>
  );
};

export default Loginn;