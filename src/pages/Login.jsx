import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccess("");
  setGeneralError("");

  if (!validate()) return;

  try {
    // Step 1: Login
    const loginRes = await axios.post("http://localhost:5000/api/auth/login", formData, {
      headers: { "Content-Type": "application/json" },
    });

    const { token, user } = loginRes.data;
    const userId = user?._id || loginRes.data?.userId || user?.id;

    if (!token || !userId) {
      throw new Error("Invalid login response: missing token or userId");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);

    // Step 2: Fetch full user data using token + userId
    const userRes = await axios.get(`http://localhost:5000/api/auth/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = userRes.data.user;

    // console.log("✅ User token:", token);
    console.log("✅ User ID:", userData._id);
    // console.log("✅ User name:", userData.name);
    // console.log("✅ User email:", userData.email);
    // console.log("✅ User role:", userData.role);

    setSuccess("Login successful!");

    setTimeout(() => navigate("/dashboard"), 1000);
  } catch (err) {
    if (err.response?.data?.message) {
      setGeneralError(err.response.data.message);
    } else {
      setGeneralError("Something went wrong. Please try again later.");
    }
    console.error("Login error:", err);
  }
};




  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 dark:bg-slate-900">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md dark:bg-slate-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Login to AI Portal
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            Enter your credentials to continue
          </p>
        </div>

        {success && (
          <p className="text-sm text-green-600 mb-4 text-center">{success}</p>
        )}

        {generalError && (
          <p className="text-sm text-red-600 mb-4 text-center">
            {generalError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              className={`mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-neutral-300 focus:ring-neutral-500"
              } dark:bg-slate-700 dark:text-white`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`mt-1 w-full rounded-md border px-3 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-neutral-300 focus:ring-neutral-500"
                } dark:bg-slate-700 dark:text-white`}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2.5 text-neutral-600 dark:text-neutral-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button
              onClick={() => navigate("/forget")}
              type="button"
              className="ml-1 font-semibold text-blue-200 hover:underline dark:text-blue-400"
            >
              Forgot password?
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-600"
          >
            Login
          </button>

          {/* Social Auth Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Continue with Google
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                alt="LinkedIn"
                className="h-5 w-5"
              />
              Continue with LinkedIn
            </button>
          </div>
        </form>

        {/* Create account */}
        <div className="mt-6 flex justify-center space-x-2 text-sm text-neutral-700 dark:text-neutral-300">
          <p>Don’t have an account?</p>
          <button
            onClick={() => navigate("/signup")}
            type="button"
            className="ml-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
