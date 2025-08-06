import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacebookAuth = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '2529573527404622',
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });

      console.log("✅ Facebook SDK initialized");
    };

    // Load SDK script
    (function (d, s, id) {
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      const fjs = d.getElementsByTagName(s)[0];
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const handleFacebookLogin = () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!window.FB) {
      setErrorMessage("❌ Facebook SDK not loaded yet.");
      return;
    }

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          window.FB.api('/me', { fields: 'name,email,picture' }, async function (userInfo) {
            const { name, email, id: facebookId, picture } = userInfo;

            // If email is missing, let backend handle fallback
            if (!facebookId) {
              setErrorMessage("❌ Unable to retrieve Facebook user ID.");
              return;
            }

            console.log("✅ Facebook user info:", userInfo);
            console.log("✅ Access token:", accessToken);

            try {
              const res = await axios.post('http://localhost:5000/api/auth/facebook', {
                accessToken,
                name,
                email,
                facebookId,
                picture: picture?.data?.url || null,
              });

              const { token: jwtToken, user } = res.data;
              const userId = user?._id || user?.id || res.data?.userId;

              if (!jwtToken || !userId) {
                throw new Error("Invalid Facebook login response from backend.");
              }

              localStorage.setItem("token", jwtToken);
              localStorage.setItem("userId", userId);

              // Fetch full user data
              const userRes = await axios.get(`http://localhost:5000/api/auth/users/${userId}`, {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              });

              const userData = userRes.data.user;
              setSuccessMessage(`🎉 Welcome, ${userData.name}! Redirecting...`);

              setTimeout(() => navigate("/dashboard"), 1500);
            } catch (error) {
              console.error("❌ Backend error:", error.response?.data || error.message);
              setErrorMessage(error.response?.data?.message || "Facebook login failed.");
            }
          });
        } else {
          setErrorMessage("❌ Facebook login was cancelled or not authorized.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <div className="flex flex-col py-2 mt-6 space-y-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleFacebookLogin}
      >
        Continue with Facebook
      </button>

      {successMessage && (
        <p className="text-green-600 text-sm">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};

export default FacebookAuth;
