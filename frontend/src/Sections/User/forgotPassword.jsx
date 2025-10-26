import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { forgotPassword } from "../../../API/api";
import LoginError from "./loginError";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);

      if (res?.data?.success) {
        setSuccessMessage("✅ Password reset link has been sent to your email!");
        setEmail("");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res?.data?.message || "Something went wrong!");
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } catch (err) {
      setErrorMessage("Server error, please try again later.");
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 rounded-lg bg-white shadow-lg border border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img className="w-[150px]" src="/logo.webp" alt="ApnaBazaar Logo" />
        </div>

        <h1 className="text-xl font-semibold text-center mb-2">
          Forgot Password?
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Enter your email and we’ll send you a reset link.
        </p>

        {/* Error Message */}
        {errorMessage && (
          <LoginError message={errorMessage} onClose={() => setErrorMessage("")} />
        )}

        {/* Smart Success Alert */}
        {successMessage && (
          <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded-md p-2 text-center text-sm animate-fadeIn">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-5"
        >
          {/* Email */}
          <div>
            <label className="text-[13px] ml-[3px] font-medium">Email Address*</label>
            <div className="relative w-full">
              <FiMail className="absolute left-3 top-[8px] text-gray-600" />
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none bg-[#f3f3f5] w-full pl-10 pr-3 h-[35px] border rounded-md text-sm focus:ring-1 focus:ring-gray-400 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!email || loading}
            className={`w-full h-[35px] text-[13px] text-white rounded-md transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-900"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <NavLink to="/" className="block text-center mt-5 text-[12px] text-gray-500 hover:text-gray-700 transition">
          ← Back to ApnaBazaar
        </NavLink>
      </div>
    </div>
  );
};

export default ForgotPassword;