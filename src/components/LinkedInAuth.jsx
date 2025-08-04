import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// LinkedIn OAuth details
const CLIENT_ID = "86z8o6dmauz2h0";
const REDIRECT_URI = "http://localhost:3000/linkedin-auth";
const STATE = "linkedin123";
const SCOPE = "r_liteprofile r_emailaddress";

export default function LinkedInAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      console.error("❌ LinkedIn authorization error:", error);
      return;
    }

    if (code) {
      console.log("✅ LinkedIn auth code received:", code);
      handleLinkedInCallback(code);
    }
  }, []);

  const handleLinkedInCallback = async (code) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/linkedin", { code });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ LinkedIn login failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = () => {
    const linkedInURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=${STATE}&scope=${encodeURIComponent(SCOPE)}`;
    window.location.href = linkedInURL;
  };

  return (
   <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
  {loading ? (
    <p className="text-lg text-gray-600 text-center">Processing LinkedIn login...</p>
  ) : (
    <button
      onClick={handleLinkedInLogin}
      className="flex items-center justify-center w-full space-x-3 bg-[#0077B5] text-white px-4 py-2 rounded-lg shadow hover:bg-[#005b8c] transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 448 512"
      >
        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.49 0 53.5 0 23.17 24.62 0 53.79 0c29.17 0 53.2 23.17 53.2 53.5 0 29.99-24.03 54.6-53.2 54.6zM447.9 448h-92.68V302.4c0-34.7-.7-79.3-48.4-79.3-48.5 0-55.9 37.9-55.9 77v147H158.1V148.9h89.1v40.8h1.3c12.4-23.5 42.5-48.4 87.5-48.4 93.5 0 110.7 61.5 110.7 141.3V448z" />
      </svg>
      <span className="text-sm sm:text-base font-medium">Continue with LinkedIn</span>
    </button>
  )}
</div>

  );
}
